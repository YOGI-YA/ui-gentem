"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Sparkles, Volume2, VolumeX } from "lucide-react";

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const LETTERS: Record<string, number[][]> = {
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
};

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bricksRemaining, setBricksRemaining] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const gameState = useRef<{
    ball: { x: number; y: number; vx: number; vy: number; radius: number; speed: number };
    paddle: { x: number; y: number; width: number; height: number; targetX: number };
    bricks: Brick[];
    particles: Particle[];
    width: number;
    height: number;
    autoplay: boolean;
  }>({
    ball: { x: 300, y: 350, vx: 3.2, vy: -3.8, radius: 5.5, speed: 4.8 },
    paddle: { x: 250, y: 440, width: 90, height: 10, targetX: 250 },
    bricks: [],
    particles: [],
    width: 700,
    height: 480,
    autoplay: true,
  });

  const initBricks = (width: number) => {
    const bricks: Brick[] = [];
    const brickSize = width < 500 ? 5.5 : 8.5;
    const gap = 2.5;
    const letterGap = width < 500 ? 12 : 22;

    const buildWord = (word: string, startY: number) => {
      let totalWordWidth = 0;
      for (const char of word) {
        const mat = LETTERS[char] || [];
        const cols = mat[0]?.length || 4;
        totalWordWidth += cols * (brickSize + gap) + letterGap;
      }
      totalWordWidth -= letterGap;

      let currentX = (width - totalWordWidth) / 2;

      for (const char of word) {
        const mat = LETTERS[char] || [];
        const rows = mat.length;
        const cols = mat[0]?.length || 4;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (mat[r][c] === 1) {
              bricks.push({
                x: currentX + c * (brickSize + gap),
                y: startY + r * (brickSize + gap),
                w: brickSize,
                h: brickSize,
                alive: true,
                color: r === 0 || r === 4 ? "#ffffff" : "#cbd5e1",
              });
            }
          }
        }
        currentX += cols * (brickSize + gap) + letterGap;
      }
    };

    buildWord("HELLO", 70);
    buildWord("WORLD", width < 500 ? 135 : 155);

    gameState.current.bricks = bricks;
    setBricksRemaining(bricks.length);
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 7; i++) {
      gameState.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4.5,
        vy: (Math.random() - 0.5) * 4.5,
        size: Math.random() * 2.5 + 1,
        alpha: 1,
        color,
      });
    }
  };

  const resetGame = (userPlay = true) => {
    const s = gameState.current;
    s.autoplay = !userPlay;
    setIsPlaying(userPlay);
    setScore(0);
    setHasWon(false);
    s.ball.x = s.width / 2;
    s.ball.y = s.paddle.y - 30;
    s.ball.vx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 1.5);
    s.ball.vy = -4.5;
    initBricks(s.width);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = Math.min(840, parent.clientWidth);
      const h = 480;
      canvas.width = w;
      canvas.height = h;
      gameState.current.width = w;
      gameState.current.height = h;
      gameState.current.paddle.y = h - 35;
      gameState.current.paddle.x = (w - gameState.current.paddle.width) / 2;
      gameState.current.paddle.targetX = gameState.current.paddle.x;
      initBricks(w);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      gameState.current.paddle.targetX = Math.max(
        0,
        Math.min(gameState.current.width - gameState.current.paddle.width, clientX - gameState.current.paddle.width / 2)
      );
      if (gameState.current.autoplay) {
        gameState.current.autoplay = false;
        setIsPlaying(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches[0].clientX - rect.left;
      gameState.current.paddle.targetX = Math.max(
        0,
        Math.min(gameState.current.width - gameState.current.paddle.width, clientX - gameState.current.paddle.width / 2)
      );
      if (gameState.current.autoplay) {
        gameState.current.autoplay = false;
        setIsPlaying(true);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Main Game Loop
    const loop = () => {
      const s = gameState.current;
      const { ball, paddle, bricks, particles, width, height } = s;

      ctx.clearRect(0, 0, width, height);

      // Autoplay AI logic if user hasn't clicked
      if (s.autoplay) {
        paddle.targetX = Math.max(0, Math.min(width - paddle.width, ball.x - paddle.width / 2));
      }

      // Smooth paddle movement
      paddle.x += (paddle.targetX - paddle.x) * 0.22;

      // Ball Physics
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall Collisions
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + ball.radius >= width) {
        ball.x = width - ball.radius;
        ball.vx = -Math.abs(ball.vx);
      }

      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
      }

      // Paddle Collision
      if (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x - ball.radius &&
        ball.x <= paddle.x + paddle.width + ball.radius &&
        ball.vy > 0
      ) {
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.vx = hitPoint * 5.2;
        ball.vy = -Math.sqrt(Math.max(16, ball.speed * ball.speed - ball.vx * ball.vx));
        spawnParticles(ball.x, paddle.y, "#ffffff");
      }

      // Ball falls below paddle
      if (ball.y > height + 20) {
        if (s.autoplay) {
          ball.x = width / 2;
          ball.y = paddle.y - 40;
          ball.vy = -4;
        } else {
          // Reset ball position
          ball.x = width / 2;
          ball.y = paddle.y - 40;
          ball.vy = -4;
        }
      }

      // Brick Collisions
      let aliveCount = 0;
      for (const b of bricks) {
        if (!b.alive) continue;
        aliveCount++;

        if (
          ball.x + ball.radius >= b.x &&
          ball.x - ball.radius <= b.x + b.w &&
          ball.y + ball.radius >= b.y &&
          ball.y - ball.radius <= b.y + b.h
        ) {
          b.alive = false;
          ball.vy = -ball.vy;
          spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color);
          setScore((prev) => {
            const next = prev + 10;
            setHighScore((h) => Math.max(h, next));
            return next;
          });
        }
      }
      setBricksRemaining(aliveCount);

      if (aliveCount === 0 && !hasWon) {
        setHasWon(true);
      }

      // Draw Bricks
      for (const b of bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [hasWon]);

  return (
    <section id="breakout" className="border-b border-border py-24 md:py-32 bg-[#060709] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[350px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-[1100px] px-6 text-center relative z-10">
        {/* Eyebrow directly from video 00:30 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <p className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
              Break it if you can. It still ships.
            </p>
            <h2 className="metallic-chrome text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mt-1">
              Interactive Breakout
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-white/40 block">SCORE</span>
              <span className="text-white font-bold text-sm sm:text-base">{score}</span>
            </div>
            <div className="text-right">
              <span className="text-white/40 block">HIGH</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Canvas Game Area */}
        <div className="relative mx-auto rounded-3xl border border-white/10 bg-[#090b0e] shadow-2xl overflow-hidden aspect-[16/10] max-h-[500px]">
          <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

          {/* Controls Overlay Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => resetGame(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              onClick={() => resetGame(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-colors shadow-sm"
            >
              <Play size={12} />
              PLAY
            </button>
          </div>

          {/* Autoplay Badge */}
          {gameState.current.autoplay && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-white/60 font-mono pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Autoplay active &bull; Move mouse to take control</span>
            </div>
          )}

          {/* Victory Toast */}
          {hasWon && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
              <Trophy size={48} className="text-amber-400 mb-2 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">SYSTEM DESTROYED & REBUILT!</h3>
              <p className="text-sm text-white/70 mt-1 mb-4">
                You successfully broke all the bricks!
              </p>
              <button
                onClick={() => resetGame(true)}
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
