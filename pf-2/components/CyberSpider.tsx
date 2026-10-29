"use client";

import { useEffect, useRef, useState } from "react";
import RobotChatModal from "@/components/RobotChatModal";

interface Leg {
  side: 1 | -1; // 1 = right, -1 = left
  baseAngle: number;
  length1: number;
  length2: number;
  footX: number;
  footY: number;
  targetFootX: number;
  targetFootY: number;
  stepPhase: number;
  isMoving: boolean;
  group: 0 | 1;
}

export default function CyberSpider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 120);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 120;
    };
    window.addEventListener("resize", onResize);

    // Spider state
    const spider = {
      x: 120,
      y: 65,
      targetX: width - 140,
      vx: 0.55, // Very slow and smooth crawl
      dir: 1 as 1 | -1,
      angle: 0,
      targetAngle: 0,
      bodyRadius: 11,
      gaitTimer: 0,
    };

    // 8 Legs configuration
    const legConfigs = [
      { side: -1 as const, baseAngle: -0.85, l1: 18, l2: 24, group: 0 as const },
      { side: -1 as const, baseAngle: -0.35, l1: 19, l2: 26, group: 1 as const },
      { side: -1 as const, baseAngle: 0.35, l1: 19, l2: 26, group: 0 as const },
      { side: -1 as const, baseAngle: 0.85, l1: 18, l2: 24, group: 1 as const },
      { side: 1 as const, baseAngle: -0.85, l1: 18, l2: 24, group: 1 as const },
      { side: 1 as const, baseAngle: -0.35, l1: 19, l2: 26, group: 0 as const },
      { side: 1 as const, baseAngle: 0.35, l1: 19, l2: 26, group: 1 as const },
      { side: 1 as const, baseAngle: 0.85, l1: 18, l2: 24, group: 0 as const },
    ];

    const legs: Leg[] = legConfigs.map((cfg) => {
      const idealX = spider.x + Math.cos(cfg.baseAngle) * 36;
      const idealY = spider.y + Math.sin(cfg.baseAngle) * 26 * cfg.side;
      return {
        side: cfg.side,
        baseAngle: cfg.baseAngle,
        length1: cfg.l1,
        length2: cfg.l2,
        footX: idealX,
        footY: idealY,
        targetFootX: idealX,
        targetFootY: idealY,
        stepPhase: 0,
        isMoving: false,
        group: cfg.group,
      };
    });

    // Two-bone inverse kinematics solver
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
      const dist = Math.min(l1 + l2 - 0.5, Math.max(8, Math.hypot(dx, dy)));
      const baseAngle = Math.atan2(dy, dx);

      // Law of cosines for knee angle
      const cosAngle = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
      const clampedCos = Math.max(-1, Math.min(1, cosAngle));
      const angleOffset = Math.acos(clampedCos) * (side < 0 ? -1 : 1);

      const kneeAngle = baseAngle + angleOffset;
      const x1 = x0 + Math.cos(kneeAngle) * l1;
      const y1 = y0 + Math.sin(kneeAngle) * l1;

      return { x1, y1 };
    };

    let turningTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check boundaries for smooth turnaround
      const minX = 80;
      const maxX = width - 80;

      if (turningTimer > 0) {
        turningTimer--;
        spider.angle += (spider.targetAngle - spider.angle) * 0.05;
      } else {
        if (spider.dir === 1 && spider.x >= maxX) {
          spider.dir = -1;
          spider.targetAngle = Math.PI;
          turningTimer = 65; // Slow deliberate turn
        } else if (spider.dir === -1 && spider.x <= minX) {
          spider.dir = 1;
          spider.targetAngle = 0;
          turningTimer = 65;
        } else {
          spider.x += spider.dir * spider.vx;
          spider.angle += (spider.targetAngle - spider.angle) * 0.08;
        }
      }

      // Gait cycle update
      spider.gaitTimer += 0.045;
      const currentActiveGroup = Math.floor(spider.gaitTimer) % 2;

      // Update Legs
      legs.forEach((leg, idx) => {
        const bodyAttachAngle = spider.angle + leg.baseAngle;
        const attachX = spider.x + Math.cos(bodyAttachAngle) * (spider.bodyRadius * 0.9);
        const attachY = spider.y + Math.sin(bodyAttachAngle) * (spider.bodyRadius * 0.7);

        // Calculate ideal natural foot position relative to spider orientation
        const reachAngle = spider.angle + leg.baseAngle * 1.1;
        const forwardBias = spider.dir * 10;
        const idealFootX = spider.x + Math.cos(reachAngle) * (leg.length1 + leg.length2 * 0.6) + forwardBias;
        const idealFootY = spider.y + Math.sin(reachAngle) * (leg.length1 + leg.length2 * 0.6) * leg.side;

        const distToIdeal = Math.hypot(leg.footX - idealFootX, leg.footY - idealFootY);

        // Initiate step when foot gets too far and its group is active
        if (!leg.isMoving && distToIdeal > 14 && leg.group === currentActiveGroup) {
          leg.isMoving = true;
          leg.stepPhase = 0;
          leg.targetFootX = idealFootX + spider.dir * 12;
          leg.targetFootY = idealFootY;
        }

        // Animate stepping foot smoothly with arch lift
        if (leg.isMoving) {
          leg.stepPhase += 0.09;
          const t = Math.min(1, leg.stepPhase);
          // Ease in-out
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

          leg.footX += (leg.targetFootX - leg.footX) * 0.28;
          leg.footY += (leg.targetFootY - leg.footY) * 0.28;

          if (leg.stepPhase >= 1) {
            leg.isMoving = false;
            leg.footX = leg.targetFootX;
            leg.footY = leg.targetFootY;
          }
        }

        // IK solve knee position
        const { x1, y1 } = solveIK(
          attachX,
          attachY,
          leg.footX,
          leg.footY,
          leg.length1,
          leg.length2,
          leg.side
        );

        // Draw Leg Segment 1 (Femur)
        ctx.beginPath();
        ctx.moveTo(attachX, attachY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = idx % 2 === 0 ? "#64748b" : "#475569";
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Draw Leg Segment 2 (Tibia)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(leg.footX, leg.footY);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Knee joint highlight
        ctx.beginPath();
        ctx.arc(x1, y1, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#cbd5e1";
        ctx.fill();

        // Foot contact dot
        ctx.beginPath();
        ctx.arc(leg.footX, leg.footY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fill();
      });

      // Draw Spider Body (Cephalothorax & Abdomen)
      ctx.save();
      ctx.translate(spider.x, spider.y);
      ctx.rotate(spider.angle);

      // Abdomen (rear body segment)
      ctx.beginPath();
      ctx.ellipse(-7, 0, 9, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1e2430";
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cephalothorax (front main carapace)
      ctx.beginPath();
      ctx.ellipse(3, 0, 7.5, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cyber Ocular Sensor (Glowing emerald/cyan visor)
      ctx.beginPath();
      ctx.arc(8, -1.8, 1.2, 0, Math.PI * 2);
      ctx.arc(8, 1.8, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Subtle carapace core pulse
      ctx.beginPath();
      ctx.arc(-4, 0, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(52, 211, 153, 0.85)";
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

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

      {/* Spider Canvas Dock */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-none select-none h-[110px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas
          ref={canvasRef}
          onClick={() => setIsChatOpen(true)}
          className="w-full h-full cursor-pointer pointer-events-auto"
          title="YogiBot &bull; Click to open AI Assistant"
        />

        {/* Minimal, Luxury Hover Pill */}
        {isHovered && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0d14]/90 border border-emerald-500/30 text-white text-[11px] font-mono tracking-widest backdrop-blur-md shadow-2xl pointer-events-none uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>YogiBot &bull; Click to Chat</span>
          </div>
        )}
      </div>
    </>
  );
}
