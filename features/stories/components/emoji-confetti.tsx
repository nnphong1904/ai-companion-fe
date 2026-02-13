"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ParticleDef = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotation: number;
  endScale: number;
  duration: number;
};

let nextId = 0;

function Particle({
  emoji,
  x,
  y,
  dx,
  dy,
  rotation,
  endScale,
  duration,
  onDone,
}: ParticleDef & { onDone: () => void }) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // Double rAF ensures the initial render is painted before the transition starts
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSettled(true));
    });
    const timer = setTimeout(onDone, duration + 50);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration, onDone]);

  return (
    <span
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        fontSize: 28,
        transform: settled
          ? `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(${endScale})`
          : "translate(-50%, -50%) scale(1)",
        opacity: settled ? 0 : 1,
        transition: [
          `transform ${duration}ms cubic-bezier(0.2, 0.85, 0.3, 1)`,
          `opacity ${Math.round(duration * 0.5)}ms ${Math.round(duration * 0.5)}ms ease-in`,
        ].join(", "),
      }}
    >
      {emoji}
    </span>
  );
}

export function useEmojiConfetti() {
  const [particles, setParticles] = useState<ParticleDef[]>([]);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const trigger = useCallback((emoji: string, x: number, y: number) => {
    const count = 7 + Math.floor(Math.random() * 4); // 7-10
    const batch: ParticleDef[] = Array.from({ length: count }, () => {
      // Fan upward: angles between -150° and -30° (upper hemisphere, wide spread)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 90 + Math.random() * 180;
      return {
        id: nextId++,
        emoji,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 20,
        rotation: (Math.random() - 0.5) * 540,
        endScale: 0.3 + Math.random() * 0.5,
        duration: 600 + Math.random() * 600,
      };
    });
    setParticles((prev) => [...prev, ...batch]);
  }, []);

  const confetti =
    particles.length > 0
      ? createPortal(
          <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            {particles.map((p) => (
              <Particle key={p.id} {...p} onDone={() => removeParticle(p.id)} />
            ))}
          </div>,
          document.body,
        )
      : null;

  return { confetti, trigger };
}
