import { motion, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { useEffect, useMemo } from "react";
import MovieCard from "./MovieCard";

/**
 * DeckCarousel
 * - Arranges cards in a circular "rolling deck" around the center
 * - Slowly auto-rotates; users can wheel/drag to nudge rotation
 */
export default function DeckCarousel({ items = [] }) {
  const rotation = useMotionValue(0);

  // Auto-rotate slowly
  useEffect(() => {
    const controls = animate(rotation, 360, {
      duration: 60,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [rotation]);

  const count = items.length || 1;
  const step = 360 / count;

  // Container size responsive via clamp
  const size = 560; // base size for calculations
  const radius = 200; // ring radius

  // Wheel interaction to nudge rotation
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 12 : -12;
    rotation.set((rotation.get() + delta) % 360);
  };

  // Drag to spin
  let dragStartX = 0;
  const onPointerDown = (e) => {
    dragStartX = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (e.pressure === 0 && e.buttons === 0) return;
    const deltaX = e.clientX - dragStartX;
    dragStartX = e.clientX;
    rotation.set((rotation.get() + deltaX * 0.25) % 360);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center overflow-visible py-8">
      <div
        className="relative h-[min(70vh,540px)] w-full"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="region"
        aria-label="Rolling movie deck carousel"
      >
        {/* Center anchor */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2" />

        {items.map((movie, i) => {
          // Angle for this card with live rotation
          const angle = useMotionTemplate`${rotation}`; // deg
          // Compute static angle offset per item
          const baseAngle = i * step;

          // We can't do math on MotionValue in render directly for x,y.
          // Instead, approximate by reading value and computing positions.
          const current = rotation.get();
          const deg = ((baseAngle + current) % 360) * (Math.PI / 180);
          const x = Math.cos(deg) * radius;
          const y = Math.sin(deg) * radius;
          const depth = (Math.sin(deg) + 1) / 2; // 0..1 (front when close to 1)
          const scale = 0.85 + depth * 0.35;
          const opacity = 0.55 + depth * 0.45;
          const zIndex = Math.round(100 + depth * 100);

          return (
            <motion.div
              key={movie.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                translateX: "-50%",
                translateY: "-50%",
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity,
                zIndex,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity, scale }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <MovieCard movie={movie} index={i} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
