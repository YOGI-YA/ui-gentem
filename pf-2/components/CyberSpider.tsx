"use client";

import { useEffect, useRef, useState } from "react";
import RobotChatModal from "@/components/RobotChatModal";

interface SpiderLeg {
  id: number;
  side: 1 | -1; // -1 = left, 1 = right
  index: number; // 0..3 from front to back
  baseAngle: number;
  femurLength: number;
  tibiaLength: number;
  footX: number;
  footY: number;
  targetFootX: number;
  targetFootY: number;
  stepProgress: number; // 0..1
  isStepping: boolean;
  phaseOffset: number; // Gait timing
}

export default function CyberSpider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hitBoxPos, setHitBoxPos] = useState({ x: 200, y: 200, angle: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Spider state
    const spider = {
      x: Math.random() * (width - 300) + 150,
      y: Math.random() * (height - 300) + 150,
      targetX: Math.random() * (width - 200) + 100,
      targetY: Math.random() * (height - 200) + 100,
      speed: 0.85,
      angle: 0,
      angularVelocity: 0,
      state: "crawling" as "crawling" | "paused",
      pauseTimer: 0,
      gaitCycle: 0,
      twitchTimer: 0,
    };

    // Pick a new random target anywhere in the full window / edges
    const pickNewDestination = () => {
      // 40% chance to target an edge (top, left, right, bottom)
      const edgeChoice = Math.random();
      if (edgeChoice < 0.25) {
        // Top edge
        spider.targetX = Math.random() * width;
        spider.targetY = Math.random() * 140 + 40;
      } else if (edgeChoice < 0.5) {
        // Side edges (left or right)
        spider.targetX = Math.random() < 0.5 ? Math.random() * 120 + 30 : width - (Math.random() * 120 + 30);
        spider.targetY = Math.random() * height;
      } else if (edgeChoice < 0.75) {
        // Bottom area
        spider.targetX = Math.random() * width;
        spider.targetY = height - (Math.random() * 160 + 50);
      } else {
        // Anywhere in open space
        spider.targetX = Math.random() * (width - 160) + 80;
        spider.targetY = Math.random() * (height - 160) + 80;
      }

      spider.state = "crawling";
    };

    // Initialize the 8 arched legs matching Black Widow anatomy in uploaded image
    // 4 legs per side:
    // 0: Front reach (long, points forward-outward)
    // 1: Mid-front
    // 2: Mid-rear
    // 3: Rear sweep (long, points backward-outward)
    const legParams = [
      // Left side
      { side: -1 as const, idx: 0, angle: -0.75, fL: 28, tL: 38, phase: 0 },
      { side: -1 as const, idx: 1, angle: -1.25, fL: 25, tL: 32, phase: 0.5 },
      { side: -1 as const, idx: 2, angle: -1.85, fL: 24, tL: 30, phase: 0.25 },
      { side: -1 as const, idx: 3, angle: -2.35, fL: 32, tL: 42, phase: 0.75 },
      // Right side
      { side: 1 as const, idx: 0, angle: 0.75, fL: 28, tL: 38, phase: 0.5 },
      { side: 1 as const, idx: 1, angle: 1.25, fL: 25, tL: 32, phase: 0 },
      { side: 1 as const, idx: 2, angle: 1.85, fL: 24, tL: 30, phase: 0.75 },
      { side: 1 as const, idx: 3, angle: 2.35, fL: 32, tL: 42, phase: 0.25 },
    ];

    const legs: SpiderLeg[] = legParams.map((p, i) => {
      const idealDist = p.fL + p.tL * 0.7;
      const initialFootX = spider.x + Math.cos(spider.angle + p.angle) * idealDist;
      const initialFootY = spider.y + Math.sin(spider.angle + p.angle) * idealDist;
      return {
        id: i,
        side: p.side,
        index: p.idx,
        baseAngle: p.angle,
        femurLength: p.fL,
        tibiaLength: p.tL,
        footX: initialFootX,
        footY: initialFootY,
        targetFootX: initialFootX,
        targetFootY: initialFootY,
        stepProgress: 1,
        isStepping: false,
        phaseOffset: p.phase,
      };
    });

    // 2-segment Inverse Kinematics solver
    const solveIK = (
      x0: number,
      y0: number,
      x2: number,
      y2: number,
      l1: number,
      l2: number,
      side: number
    ) => {
      const dx = x2 - x0;
      const dy = y2 - y0;
      const dist = Math.min(l1 + l2 - 1, Math.max(8, Math.hypot(dx, dy)));
      const baseA = Math.atan2(dy, dx);

      const cosA = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
      const clamped = Math.max(-1, Math.min(1, cosA));
      const kneeOffset = Math.acos(clamped) * (side < 0 ? -1 : 1);

      const kneeAngle = baseA + kneeOffset;
      const x1 = x0 + Math.cos(kneeAngle) * l1;
      const y1 = y0 + Math.sin(kneeAngle) * l1;

      return { x1, y1 };
    };

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // --- Behavior & Navigation ---
      const distToTarget = Math.hypot(spider.targetX - spider.x, spider.targetY - spider.y);

      if (spider.state === "crawling") {
        if (distToTarget < 30) {
          // Reached destination -> pause and look around
          spider.state = "paused";
          spider.pauseTimer = Math.floor(Math.random() * 120 + 80); // 1.5 - 3.5s pause
        } else {
          // Desired heading angle
          const desiredAngle = Math.atan2(spider.targetY - spider.y, spider.targetX - spider.x);

          // Smooth shortest-path angle wrapping
          let angleDiff = desiredAngle - spider.angle;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

          spider.angle += angleDiff * 0.045;

          // Crawl forward along heading
          spider.x += Math.cos(spider.angle) * spider.speed;
          spider.y += Math.sin(spider.angle) * spider.speed;

          spider.gaitCycle += 0.065;
        }
      } else {
        // Paused state
        spider.pauseTimer--;
        spider.twitchTimer += 0.05;
        if (spider.pauseTimer <= 0) {
          pickNewDestination();
        }
      }

      // Update hit box for click detection
      if (frameCount % 6 === 0) {
        setHitBoxPos({ x: spider.x, y: spider.y, angle: spider.angle });
      }

      // --- 3D Drop Shadow Pass ---
      // Global soft shadow offset (simulating light from top-left)
      const shadowOffsetX = 12;
      const shadowOffsetY = 16;

      ctx.save();
      // Abdomen & Cephalothorax shadow
      ctx.beginPath();
      ctx.ellipse(
        spider.x + shadowOffsetX,
        spider.y + shadowOffsetY + 4,
        18,
        14,
        spider.angle,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.filter = "blur(8px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();

      // --- Leg Shadows ---
      legs.forEach((leg) => {
        const bodyAttachAngle = spider.angle + leg.baseAngle;
        const attachX = spider.x + Math.cos(bodyAttachAngle) * 9;
        const attachY = spider.y + Math.sin(bodyAttachAngle) * 9;

        const { x1, y1 } = solveIK(
          attachX,
          attachY,
          leg.footX,
          leg.footY,
          leg.femurLength,
          leg.tibiaLength,
          leg.side
        );

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(attachX + shadowOffsetX * 0.6, attachY + shadowOffsetY * 0.6);
        ctx.lineTo(x1 + shadowOffsetX * 0.8, y1 + shadowOffsetY * 0.8);
        ctx.lineTo(leg.footX + shadowOffsetX * 0.3, leg.footY + shadowOffsetY * 0.3);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.filter = "blur(4px)";
        ctx.stroke();
        ctx.filter = "none";
        ctx.restore();
      });

      // --- Leg Mechanics & Stepping Gait ---
      legs.forEach((leg) => {
        const bodyAttachAngle = spider.angle + leg.baseAngle;
        const attachX = spider.x + Math.cos(bodyAttachAngle) * 9;
        const attachY = spider.y + Math.sin(bodyAttachAngle) * 9;

        // Calculate natural planted foot position
        const reachDist = leg.femurLength + leg.tibiaLength * 0.72;
        const idealFootX = spider.x + Math.cos(spider.angle + leg.baseAngle * 1.05) * reachDist;
        const idealFootY = spider.y + Math.sin(spider.angle + leg.baseAngle * 1.05) * reachDist;

        const distFromIdeal = Math.hypot(leg.footX - idealFootX, leg.footY - idealFootY);

        // Check if leg should step
        const cycleProgress = (spider.gaitCycle + leg.phaseOffset) % 1;
        if (!leg.isStepping && distFromIdeal > 18 && cycleProgress < 0.35 && spider.state === "crawling") {
          leg.isStepping = true;
          leg.stepProgress = 0;
          // Step forward in direction of motion
          const strideLead = 22;
          leg.targetFootX = idealFootX + Math.cos(spider.angle) * strideLead;
          leg.targetFootY = idealFootY + Math.sin(spider.angle) * strideLead;
        }

        // Stepping interpolation
        if (leg.isStepping) {
          leg.stepProgress += 0.08;
          const t = Math.min(1, leg.stepProgress);
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

          leg.footX += (leg.targetFootX - leg.footX) * 0.35;
          leg.footY += (leg.targetFootY - leg.footY) * 0.35;

          if (leg.stepProgress >= 1) {
            leg.isStepping = false;
            leg.footX = leg.targetFootX;
            leg.footY = leg.targetFootY;
          }
        }

        // Solve Knee position with IK
        const { x1, y1 } = solveIK(
          attachX,
          attachY,
          leg.footX,
          leg.footY,
          leg.femurLength,
          leg.tibiaLength,
          leg.side
        );

        // --- Render Leg Segments (Photorealistic Black Widow styling) ---
        // Femur Segment (Deep glossy black with highlight)
        ctx.beginPath();
        ctx.moveTo(attachX, attachY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = "#09090b";
        ctx.lineWidth = 3.6;
        ctx.lineCap = "round";
        ctx.stroke();

        // White specular dorsal highlight on femur
        ctx.beginPath();
        ctx.moveTo(attachX + 0.5, attachY - 0.5);
        ctx.lineTo(x1 + 0.5, y1 - 0.5);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Knobby Knee Joint Node (as seen in drawing)
        ctx.beginPath();
        ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#18181b";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x1 - 0.5, y1 - 0.5, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.fill();

        // Tibia / Tarsus Segment (Needle sharp taper)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(leg.footX, leg.footY);
        ctx.strokeStyle = "#09090b";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Tibia specular highlight
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(leg.footX, leg.footY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Ultra-sharp needle tip claw
        ctx.beginPath();
        ctx.arc(leg.footX, leg.footY, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // --- Render Spider Body (Cephalothorax + Bulbous Abdomen with Red Hourglass) ---
      ctx.save();
      ctx.translate(spider.x, spider.y);
      ctx.rotate(spider.angle);

      // 1. Chelicerae / Front Fangs (Pedipalps)
      const twitch = spider.state === "paused" ? Math.sin(spider.twitchTimer * 3) * 1.5 : 0;
      ctx.beginPath();
      ctx.moveTo(10, -3);
      ctx.lineTo(15 + twitch, -2);
      ctx.moveTo(10, 3);
      ctx.lineTo(15 + twitch, 2);
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Cephalothorax (Front head segment)
      ctx.beginPath();
      ctx.ellipse(3, 0, 9.5, 7.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#09090b";
      ctx.fill();
      ctx.strokeStyle = "#27272a";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cephalothorax gloss highlight
      ctx.beginPath();
      ctx.ellipse(4, -2.5, 5, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.fill();

      // 3. Abdomen (Large bulbous rear segment matching Black Widow drawing)
      ctx.beginPath();
      ctx.ellipse(-14, 0, 15.5, 12.5, 0, 0, Math.PI * 2);
      const abdomenGrad = ctx.createRadialGradient(-12, -4, 2, -14, 0, 16);
      abdomenGrad.addColorStop(0, "#27272a");
      abdomenGrad.addColorStop(0.4, "#09090b");
      abdomenGrad.addColorStop(1, "#000000");
      ctx.fillStyle = abdomenGrad;
      ctx.fill();
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Iconic Red Hourglass / Crimson Dorsal Mark (from user reference image!)
      ctx.save();
      ctx.translate(-14, 0);

      // Top triangle of hourglass
      ctx.beginPath();
      ctx.moveTo(-5, -6);
      ctx.lineTo(5, -6);
      ctx.lineTo(0, -0.5);
      ctx.closePath();
      ctx.fillStyle = "#dc2626";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 10;
      ctx.fill();

      // Bottom triangle of hourglass
      ctx.beginPath();
      ctx.moveTo(-5, 6);
      ctx.lineTo(5, 6);
      ctx.lineTo(0, 0.5);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#dc2626";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Vivid central ruby core
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#f87171";
      ctx.fill();
      ctx.restore();

      // 5. Glossy 3D curved specular reflection on abdomen
      ctx.beginPath();
      ctx.ellipse(-17, -4.5, 8.5, 4, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <RobotChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Fullscreen Transparent Autonomous Spider Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[75] pointer-events-none select-none w-full h-full"
      />

      {/* Interactive Hitbox tracking the Spider's body for click to chat */}
      <div
        onClick={() => setIsChatOpen(true)}
        className="fixed z-[76] w-20 h-20 -ml-10 -mt-10 rounded-full cursor-pointer pointer-events-auto group"
        style={{
          left: `${hitBoxPos.x}px`,
          top: `${hitBoxPos.y}px`,
        }}
        title="YogiBot • Click to chat"
      >
        {/* Subtle, elegant tooltip only on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/80 border border-red-500/30 text-white text-[10px] font-mono tracking-wider backdrop-blur-md pointer-events-none whitespace-nowrap shadow-lg">
          <span className="text-red-400">&bull;</span> YogiBot &bull; AI Assistant
        </div>
      </div>
    </>
  );
}
