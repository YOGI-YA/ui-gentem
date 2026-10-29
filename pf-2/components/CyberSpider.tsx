"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import RobotChatModal from "@/components/RobotChatModal";

// --- Types ---
interface SpiderLeg {
  id: number;
  side: 1 | -1; // -1 = left, 1 = right
  index: number; // 0..3 (0: front reach, 1: mid-front, 2: mid-rear, 3: rear sweep)
  baseAngle: number;
  femurLength: number;
  tibiaLength: number;
  footX: number;
  footY: number;
  targetFootX: number;
  targetFootY: number;
  stepProgress: number; // 0..1
  isStepping: boolean;
  phaseOffset: number; // Gait phase
  liftHeight: number; // Dynamic foot lift for crazy skittering
}

interface WebStrand {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sag: number;
}

interface SpiderWeb {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  duration: number; // ms to live
  radials: { x: number; y: number }[];
  spirals: WebStrand[];
  dewNodes: { x: number; y: number; size: number }[];
  vibration: number; // vibration intensity
  tetherX?: number; // lifeline to spider
  tetherY?: number;
}

// Subtle procedural web audio synthesis for "thwip" silk throw sound
function playWebSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // White noise burst with quick resonant lowpass sweep (sounds like silk snapping through air)
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.16);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.17);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {
    // Audio context silently unavailable or restricted
  }
}

export default function CyberSpider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hitBoxPos, setHitBoxPos] = useState({ x: 200, y: 200, angle: 0 });
  const [isScurryingState, setIsScurryingState] = useState(false);

  // Interaction dispatcher ref
  const interactionRef = useRef<{
    onSingleClick: () => void;
    onDoubleTap: () => void;
  }>({
    onSingleClick: () => {},
    onDoubleTap: () => {},
  });

  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  // Click & Double Tap handling
  const handlePointerDown = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const diff = now - lastTapTimeRef.current;

    if (diff < 320) {
      // DOUBLE TAP / DOUBLE CLICK DETECTED!
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      lastTapTimeRef.current = 0;
      interactionRef.current.onDoubleTap();
    } else {
      // Possible single click: debounce 230ms to check for double tap
      lastTapTimeRef.current = now;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        interactionRef.current.onSingleClick();
        clickTimerRef.current = null;
      }, 230);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    const onResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener("resize", onResize);

    // Active webs created by the spider
    const webs: SpiderWeb[] = [];

    // Spider state
    const spider = {
      x: Math.random() * (window.innerWidth - 300) + 150,
      y: Math.random() * (window.innerHeight - 300) + 150,
      targetX: Math.random() * (window.innerWidth - 200) + 100,
      targetY: Math.random() * (window.innerHeight - 200) + 100,
      speed: 1.4,
      normalSpeed: 1.4,
      crazySpeed: 8.2, // Ultra-fast sprint on click!
      angle: 0,
      state: "stalking" as "stalking" | "frozen" | "scurrying" | "saluting",
      stateTimer: 0,
      gaitCycle: 0,
      twitchTimer: 0,
      scurryTimeLeft: 0,
      respiration: 0,
      saluteProgress: 0,
      trailSilk: [] as { x: number; y: number; alpha: number }[],
    };

    // Helper to throw a procedural web at the spider's location
    const throwWeb = (originX: number, originY: number) => {
      playWebSound();

      // Create 8 - 11 radial spines
      const radialCount = Math.floor(Math.random() * 3) + 8;
      const baseRadius = Math.random() * 35 + 65;
      const radials: { x: number; y: number }[] = [];

      for (let i = 0; i < radialCount; i++) {
        const radAngle = (i / radialCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radDist = baseRadius * (0.8 + Math.random() * 0.45);
        radials.push({
          x: originX + Math.cos(radAngle) * radDist,
          y: originY + Math.sin(radAngle) * radDist,
        });
      }

      // Create concentric spirals between adjacent radials
      const rings = 4;
      const spirals: WebStrand[] = [];
      const dewNodes: { x: number; y: number; size: number }[] = [];

      for (let r = 1; r <= rings; r++) {
        const ringFraction = r / (rings + 0.5);
        for (let i = 0; i < radialCount; i++) {
          const next = (i + 1) % radialCount;
          const x1 = originX + (radials[i].x - originX) * ringFraction;
          const y1 = originY + (radials[i].y - originY) * ringFraction;
          const x2 = originX + (radials[next].x - originX) * ringFraction;
          const y2 = originY + (radials[next].y - originY) * ringFraction;
          const sag = (Math.random() * 0.15 + 0.05) * ringFraction * 20;

          spirals.push({ x1, y1, x2, y2, sag });

          // Droplets on web nodes
          if (Math.random() > 0.4) {
            dewNodes.push({
              x: (x1 + x2) / 2 + (Math.random() - 0.5) * 2,
              y: (y1 + y2) / 2 + (Math.random() - 0.5) * 2,
              size: Math.random() * 1.5 + 1,
            });
          }
        }
      }

      webs.push({
        id: Date.now() + Math.random(),
        x: originX,
        y: originY,
        createdAt: Date.now(),
        duration: 9000, // 9 seconds duration
        radials,
        spirals,
        dewNodes,
        vibration: 1.0,
        tetherX: originX,
        tetherY: originY,
      });

      // Cap maximum active webs to prevent clutter
      if (webs.length > 5) webs.shift();
    };

    // Pick a frantic escape destination on single click
    const pickEscapeTarget = () => {
      // Flee toward an opposite corner or screen border
      const margin = 60;
      const corners = [
        { x: margin, y: margin },
        { x: window.innerWidth - margin, y: margin },
        { x: margin, y: window.innerHeight - margin },
        { x: window.innerWidth - margin, y: window.innerHeight - margin },
        { x: window.innerWidth / 2, y: margin },
        { x: margin, y: window.innerHeight / 2 },
        { x: window.innerWidth - margin, y: window.innerHeight / 2 },
      ];

      // Find the corner farthest from current position
      corners.sort((a, b) => {
        const distA = Math.hypot(a.x - spider.x, a.y - spider.y);
        const distB = Math.hypot(b.x - spider.x, b.y - spider.y);
        return distB - distA;
      });

      const chosen = corners[Math.floor(Math.random() * 3)];
      spider.targetX = chosen.x;
      spider.targetY = chosen.y;
    };

    // Pick a crazy autonomous wandering destination across full screen
    const pickAutonomousTarget = () => {
      const mode = Math.random();
      if (mode < 0.3) {
        // Skim along top header/nav area
        spider.targetX = Math.random() * (window.innerWidth - 120) + 60;
        spider.targetY = Math.random() * 120 + 40;
      } else if (mode < 0.6) {
        // Skim along left or right sidebars
        spider.targetX =
          Math.random() < 0.5
            ? Math.random() * 100 + 40
            : window.innerWidth - (Math.random() * 100 + 40);
        spider.targetY = Math.random() * (window.innerHeight - 140) + 70;
      } else {
        // Dart across diagonal center
        spider.targetX = Math.random() * (window.innerWidth - 160) + 80;
        spider.targetY = Math.random() * (window.innerHeight - 160) + 80;
      }

      spider.state = "stalking";
      spider.speed = spider.normalSpeed * (0.85 + Math.random() * 0.9);
    };

    // Wire single click and double tap interactions
    interactionRef.current.onSingleClick = () => {
      // 1. THROW THE WEB!
      throwWeb(spider.x, spider.y);

      // 2. RUN FASTER (Crazy panic scurry mode!)
      spider.state = "scurrying";
      spider.scurryTimeLeft = 190; // ~3.2 seconds at 60fps
      spider.speed = spider.crazySpeed;
      pickEscapeTarget();
      setIsScurryingState(true);
    };

    interactionRef.current.onDoubleTap = () => {
      // Stop moving immediately and salute / open chat!
      spider.state = "saluting";
      spider.stateTimer = 90;
      setIsChatOpen(true);
    };

    // Initialize 8 hyper-realistic Black Widow limbs matching uploaded image anatomy
    const legConfig = [
      // Left side:
      // 0: Long front probing leg (forward-outward)
      { side: -1 as const, idx: 0, angle: -0.68, fL: 32, tL: 44, phase: 0 },
      // 1: Mid-front arching leg
      { side: -1 as const, idx: 1, angle: -1.22, fL: 28, tL: 36, phase: 0.5 },
      // 2: Mid-rear leg
      { side: -1 as const, idx: 2, angle: -1.82, fL: 26, tL: 34, phase: 0.25 },
      // 3: Sweeping long rear leg
      { side: -1 as const, idx: 3, angle: -2.38, fL: 36, tL: 48, phase: 0.75 },
      // Right side:
      { side: 1 as const, idx: 0, angle: 0.68, fL: 32, tL: 44, phase: 0.5 },
      { side: 1 as const, idx: 1, angle: 1.22, fL: 28, tL: 36, phase: 0 },
      { side: 1 as const, idx: 2, angle: 1.82, fL: 26, tL: 34, phase: 0.75 },
      { side: 1 as const, idx: 3, angle: 2.38, fL: 36, tL: 48, phase: 0.25 },
    ];

    const legs: SpiderLeg[] = legConfig.map((p, i) => {
      const idealDist = p.fL + p.tL * 0.72;
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
        liftHeight: 0,
      };
    });

    // 2-segment Analytical Inverse Kinematics solver
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
      const dist = Math.min(l1 + l2 - 1.5, Math.max(10, Math.hypot(dx, dy)));
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

      ctx.save();
      ctx.scale(dpr, dpr);

      // --- 1. RENDER ACTIVE WEBS ON SCREEN ---
      const now = Date.now();
      for (let w = webs.length - 1; w >= 0; w--) {
        const web = webs[w];
        const age = now - web.createdAt;
        if (age > web.duration) {
          webs.splice(w, 1);
          continue;
        }

        // Fade out gracefully over the last 2.5 seconds
        const fadeStart = web.duration - 2500;
        const opacity = age > fadeStart ? Math.max(0, (web.duration - age) / 2500) : 1;

        // Damped vibration on newly shot web
        const vibFactor = Math.sin(age * 0.05) * Math.exp(-age * 0.003) * 3;

        ctx.save();
        ctx.globalAlpha = opacity;

        // 1a. Radial anchor lines
        ctx.beginPath();
        for (const r of web.radials) {
          ctx.moveTo(web.x, web.y);
          ctx.lineTo(r.x + vibFactor, r.y + vibFactor);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // 1b. Spiral connecting rings with catenary curve
        ctx.beginPath();
        for (const s of web.spirals) {
          const midX = (s.x1 + s.x2) / 2;
          const midY = (s.y1 + s.y2) / 2 + s.sag + vibFactor * 0.5;
          ctx.moveTo(s.x1, s.y1);
          ctx.quadraticCurveTo(midX, midY, s.x2, s.y2);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // 1c. Glistening dew beads
        for (const node of web.dewNodes) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 4;
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // 1d. Direct silk thread connection back to spider's spinneret while in panic
        if (spider.scurryTimeLeft > 0 && web.tetherX && web.tetherY) {
          ctx.beginPath();
          ctx.moveTo(web.tetherX, web.tetherY);
          const spinX = spider.x - Math.cos(spider.angle) * 22;
          const spinY = spider.y - Math.sin(spider.angle) * 22;
          ctx.quadraticCurveTo(
            (web.tetherX + spinX) / 2,
            (web.tetherY + spinY) / 2 + 10,
            spinX,
            spinY
          );
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- 2. SPIDER LOGIC & STATE MACHINE ---
      spider.respiration += 0.04;
      spider.twitchTimer += 0.08;

      const distToTarget = Math.hypot(spider.targetX - spider.x, spider.targetY - spider.y);

      if (spider.state === "scurrying") {
        // RUN FASTER MODE! Frantic high-cadence escape
        spider.scurryTimeLeft--;
        spider.speed = spider.crazySpeed;
        spider.gaitCycle += 0.24; // 4x gait cadence!

        if (distToTarget < 50 || spider.scurryTimeLeft <= 0) {
          spider.state = "frozen";
          spider.stateTimer = Math.floor(Math.random() * 60 + 50); // Freeze alertly
          spider.speed = spider.normalSpeed;
          setIsScurryingState(false);
        } else {
          // Rapid steering toward escape target
          const desiredAngle = Math.atan2(spider.targetY - spider.y, spider.targetX - spider.x);
          let angleDiff = desiredAngle - spider.angle;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          spider.angle += angleDiff * 0.16;

          spider.x += Math.cos(spider.angle) * spider.speed;
          spider.y += Math.sin(spider.angle) * spider.speed;
        }
      } else if (spider.state === "stalking") {
        // Realistic erratic stalking: bursts of skittering
        spider.gaitCycle += 0.075;

        if (distToTarget < 35) {
          // Instant freeze (predator instinct)
          spider.state = "frozen";
          spider.stateTimer = Math.floor(Math.random() * 90 + 40);
        } else {
          const desiredAngle = Math.atan2(spider.targetY - spider.y, spider.targetX - spider.x);
          let angleDiff = desiredAngle - spider.angle;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          spider.angle += angleDiff * 0.055;

          spider.x += Math.cos(spider.angle) * spider.speed;
          spider.y += Math.sin(spider.angle) * spider.speed;
        }
      } else if (spider.state === "frozen") {
        // Frozen state: twitch pedipalps and micro-adjust legs
        spider.stateTimer--;
        if (spider.stateTimer <= 0) {
          pickAutonomousTarget();
        }
      } else if (spider.state === "saluting") {
        // Double-tap greeting salute
        spider.saluteProgress = Math.min(1, spider.saluteProgress + 0.06);
        spider.stateTimer--;
        if (spider.stateTimer <= 0) {
          spider.state = "frozen";
          spider.stateTimer = 60;
        }
      }

      // Keep spider within visible bounds
      spider.x = Math.max(30, Math.min(window.innerWidth - 30, spider.x));
      spider.y = Math.max(30, Math.min(window.innerHeight - 30, spider.y));

      // Update interactive hitbox tracking
      if (frameCount % 4 === 0) {
        setHitBoxPos({ x: spider.x, y: spider.y, angle: spider.angle });
      }

      // --- 3. MULTI-LAYER 3D DROP SHADOWS (Drawing depth from reference photo) ---
      const shadowOffsetX = 14;
      const shadowOffsetY = 18;

      // 3a. Deep soft body drop shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        spider.x + shadowOffsetX,
        spider.y + shadowOffsetY + 4,
        22,
        16,
        spider.angle,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.filter = "blur(10px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();

      // 3b. Leg shadows (elevated knee cast shadow)
      legs.forEach((leg) => {
        const bodyAttachAngle = spider.angle + leg.baseAngle;
        const attachX = spider.x + Math.cos(bodyAttachAngle) * 11;
        const attachY = spider.y + Math.sin(bodyAttachAngle) * 11;

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
        ctx.moveTo(attachX + shadowOffsetX * 0.5, attachY + shadowOffsetY * 0.5);
        ctx.lineTo(x1 + shadowOffsetX * 0.85, y1 + shadowOffsetY * 0.85);
        ctx.lineTo(leg.footX + 2, leg.footY + 3);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.32)";
        ctx.lineWidth = 2.8;
        ctx.lineCap = "round";
        ctx.filter = "blur(5px)";
        ctx.stroke();
        ctx.filter = "none";
        ctx.restore();

        // 3c. Crisp needle-contact pin shadow at claw tip
        ctx.beginPath();
        ctx.ellipse(leg.footX + 1.5, leg.footY + 2, 2.5, 1.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fill();
      });

      // --- 4. LEG MECHANICS & ORGANIC SKITTERING GAIT ---
      legs.forEach((leg) => {
        const bodyAttachAngle = spider.angle + leg.baseAngle;
        const attachX = spider.x + Math.cos(bodyAttachAngle) * 11;
        const attachY = spider.y + Math.sin(bodyAttachAngle) * 11;

        // Front legs salute elevation if in salute mode
        const isFrontSalute = spider.state === "saluting" && leg.index === 0;

        // Ideal planted foot position based on posture
        const reachDist = leg.femurLength + leg.tibiaLength * 0.74;
        let idealFootX = spider.x + Math.cos(spider.angle + leg.baseAngle * 1.08) * reachDist;
        let idealFootY = spider.y + Math.sin(spider.angle + leg.baseAngle * 1.08) * reachDist;

        if (isFrontSalute) {
          idealFootX = spider.x + Math.cos(spider.angle + leg.side * 0.35) * (reachDist * 1.25);
          idealFootY = spider.y + Math.sin(spider.angle + leg.side * 0.35) * (reachDist * 1.25);
        }

        const distFromIdeal = Math.hypot(leg.footX - idealFootX, leg.footY - idealFootY);

        // Check if leg should step
        const stepThreshold = spider.state === "scurrying" ? 14 : 20;
        const stepSpeed = spider.state === "scurrying" ? 0.32 : 0.12;

        if (
          !leg.isStepping &&
          distFromIdeal > stepThreshold &&
          (spider.state === "stalking" || spider.state === "scurrying")
        ) {
          leg.isStepping = true;
          leg.stepProgress = 0;
          const strideLead = spider.state === "scurrying" ? 34 : 22;
          leg.targetFootX = idealFootX + Math.cos(spider.angle) * strideLead;
          leg.targetFootY = idealFootY + Math.sin(spider.angle) * strideLead;
        }

        // Stepping kinematics
        if (leg.isStepping) {
          leg.stepProgress += stepSpeed;
          leg.footX += (leg.targetFootX - leg.footX) * 0.42;
          leg.footY += (leg.targetFootY - leg.footY) * 0.42;

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

        // --- RENDER REALISTIC BLACK WIDOW LIMBS ---
        // 1. Femur Segment (Deep lacquered obsidian black)
        ctx.beginPath();
        ctx.moveTo(attachX, attachY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = "#08080a";
        ctx.lineWidth = 4.2;
        ctx.lineCap = "round";
        ctx.stroke();

        // 2. White specular dorsal highlight on femur
        ctx.beginPath();
        ctx.moveTo(attachX + 0.6, attachY - 0.6);
        ctx.lineTo(x1 + 0.6, y1 - 0.6);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.48)";
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 3. Knobby Knee Node (as seen prominently in reference drawing)
        ctx.beginPath();
        ctx.arc(x1, y1, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#18181b";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x1 - 0.6, y1 - 0.6, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // 4. Tibia & Tarsus (Tapering curved segment)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(leg.footX, leg.footY);
        ctx.strokeStyle = "#09090b";
        ctx.lineWidth = 2.7;
        ctx.lineCap = "round";
        ctx.stroke();

        // 5. Specular highlight on tibia
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(leg.footX, leg.footY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // 6. Needle sharp claw tip
        ctx.beginPath();
        ctx.arc(leg.footX, leg.footY, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // --- 5. RENDER SPIDER BODY (CEPHALOTHORAX & BULBOUS ABDOMEN) ---
      ctx.save();
      ctx.translate(spider.x, spider.y);
      ctx.rotate(spider.angle);

      // Subtle breathing pulse on abdomen
      const breathe = Math.sin(spider.respiration) * 0.6;

      // 5a. Active Pedipalps & Chelicerae Fangs (twitching crazily)
      const fangTwitch = Math.sin(spider.twitchTimer * 4) * 2;
      ctx.beginPath();
      ctx.moveTo(11, -3.5);
      ctx.lineTo(17 + fangTwitch, -2);
      ctx.moveTo(11, 3.5);
      ctx.lineTo(17 + fangTwitch, 2);
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Sharp fang glints
      ctx.beginPath();
      ctx.arc(17 + fangTwitch, -2, 0.9, 0, Math.PI * 2);
      ctx.arc(17 + fangTwitch, 2, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // 5b. Cephalothorax (Front head carapace)
      ctx.beginPath();
      ctx.ellipse(3.5, 0, 11, 8.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#09090b";
      ctx.fill();
      ctx.strokeStyle = "#27272a";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Cephalothorax gloss highlight
      ctx.beginPath();
      ctx.ellipse(4.5, -3, 6, 3, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();

      // Cluster of 8 glistening ruby/white eyes
      const eyeTwinkle = spider.state === "scurrying" ? "#ef4444" : "#ffffff";
      ctx.beginPath();
      ctx.arc(12, -2.5, 0.9, 0, Math.PI * 2);
      ctx.arc(12, 2.5, 0.9, 0, Math.PI * 2);
      ctx.arc(13.2, -1, 0.8, 0, Math.PI * 2);
      ctx.arc(13.2, 1, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = eyeTwinkle;
      ctx.fill();

      // 5c. Massive Bulbous Abdomen (Latrodectus anatomy)
      const abRadiusX = 18 + breathe;
      const abRadiusY = 14.5 + breathe * 0.7;
      ctx.beginPath();
      ctx.ellipse(-16, 0, abRadiusX, abRadiusY, 0, 0, Math.PI * 2);
      const abdomenGrad = ctx.createRadialGradient(-13, -5, 2, -16, 0, 19);
      abdomenGrad.addColorStop(0, "#2a2a2f");
      abdomenGrad.addColorStop(0.35, "#0d0d10");
      abdomenGrad.addColorStop(1, "#000000");
      ctx.fillStyle = abdomenGrad;
      ctx.fill();
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // 5d. ICONIC CRIMSON HOURGLASS (Exact match to reference drawing!)
      ctx.save();
      ctx.translate(-16, 0);

      // Top triangle
      ctx.beginPath();
      ctx.moveTo(-6, -7);
      ctx.lineTo(6, -7);
      ctx.lineTo(0, -0.6);
      ctx.closePath();
      ctx.fillStyle = "#dc2626";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = spider.state === "scurrying" ? 18 : 10;
      ctx.fill();

      // Bottom triangle
      ctx.beginPath();
      ctx.moveTo(-6, 7);
      ctx.lineTo(6, 7);
      ctx.lineTo(0, 0.6);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#dc2626";
      ctx.shadowBlur = spider.state === "scurrying" ? 18 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner glowing ruby core
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#f87171";
      ctx.fill();
      ctx.restore();

      // 5e. Dramatic 3D curved specular reflection on abdomen shoulder
      ctx.beginPath();
      ctx.ellipse(-19, -5.5, 10, 4.5, -0.32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();

      // 5f. Posterior Spinnerets
      ctx.beginPath();
      ctx.arc(-33.5 - breathe, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#18181b";
      ctx.fill();

      ctx.restore(); // restore spider body rotation
      ctx.restore(); // restore dpr scale

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

      {/* Fullscreen Transparent Canvas for Autonomous 3D Black Widow & Webs */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[75] pointer-events-none select-none w-full h-full"
      />

      {/* Interactive Hitbox tracking the Spider's body for Click & Double Tap */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
          }
          interactionRef.current.onDoubleTap();
        }}
        className="fixed z-[76] w-24 h-24 -ml-12 -mt-12 rounded-full cursor-pointer pointer-events-auto group touch-none select-none"
        style={{
          left: `${hitBoxPos.x}px`,
          top: `${hitBoxPos.y}px`,
        }}
        title="Black Widow Spider • Click to throw web & run, Double tap to talk"
      >
        {/* Subtle, sleek HUD tooltip on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/85 border border-red-500/30 text-white text-[10px] font-mono tracking-wider backdrop-blur-md pointer-events-none whitespace-nowrap shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>
            {isScurryingState ? (
              <span className="text-red-400 font-semibold">PANIC RUNNING! 🕷️💨</span>
            ) : (
              <>
                <span className="text-red-400">Click:</span> Web & Run &bull;{" "}
                <span className="text-emerald-400">2x Tap:</span> Talk
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
