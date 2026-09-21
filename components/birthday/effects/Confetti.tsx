'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type ConfettiProps = {
  /** Change this value to fire a burst. `0` never fires. */
  fireKey: number;
  /** Roughly how many pieces. Kept small so phones stay smooth. */
  count?: number;
  origin?: { x: number; y: number };
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
};

const COLORS = ['#B0A4DA', '#E9D9BE', '#F5F5F5', '#C8BFE8'];

export default function Confetti({ fireKey, count = 70, origin }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const originX = origin?.x ?? 0.5;
  const originY = origin?.y ?? 0.42;

  useEffect(() => {
    if (!fireKey || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centreX = originX * width;
    const centreY = originY * height;

    const pieces: Piece[] = Array.from({ length: count }, (_, index) => {
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 2.1;
      const speed = 2.6 + Math.random() * 5.2;
      return {
        x: centreX + (Math.random() - 0.5) * 40,
        y: centreY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.24,
        color: COLORS[index % COLORS.length],
        life: 0,
      };
    });

    const maxLife = 190;
    let elapsed = 0;

    const draw = () => {
      elapsed += 1;
      context.clearRect(0, 0, width, height);

      for (const piece of pieces) {
        piece.life += 1;
        piece.vy += 0.1;
        piece.vx *= 0.992;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.spin;

        const fade = Math.max(0, 1 - piece.life / maxLife);
        if (fade <= 0) continue;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.globalAlpha = fade;
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
        context.restore();
      }

      if (elapsed < maxLife) {
        frameRef.current = requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      context.clearRect(0, 0, width, height);
    };
  }, [fireKey, count, originX, originY, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
