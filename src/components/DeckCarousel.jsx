import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import MovieCard from "./MovieCard";

/**
 * DeckCarousel
 * - Arranges cards in a circular "rolling deck" around the center
 * - Slowly auto-rotates; users can wheel/drag to nudge rotation
 * - Swipe left/right to move to next/prev card (loops)
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
  const radius = 200; // ring radius

  // Wheel interaction to nudge rotation
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 12 : -12;
    rotation.set((rotation.get() + delta) % 360);
  };

  // Pointer interactions for drag and swipe
  const dragStartX = useRef(0);
  const dragAccum = useRef(0);
  const dragging = useRef(false);
  const lastTime = useRef(0);
  const lastX = useRef(0);

  const onPointerDown = (e) => {
    dragging.current = true;
    dragStartX.current = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    dragAccum.current = 0;
    lastX.current = dragStartX.current;
    lastTime.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? lastX.current;
    const dx = x - lastX.current;
    lastX.current = x;
    dragAccum.current += dx;
    rotation.set((rotation.get() + dx * 0.25) % 360);
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const total = dragAccum.current;
    // Swipe threshold: if quick large move, step; else if small, snap to nearest
    if (Math.abs(total) > 40) {
      // swipe left (negative dx) -> next card (increase rotation), right -> previous
      const direction = total < 0 ? 1 : -1;
      const target = rotation.get() + direction * step;
      animate(rotation, target, { type: "spring", stiffness: 120, damping: 20 });
    } else {
      // Snap to nearest step so a card is neatly positioned
      const current = rotation.get();
      const remainder = ((current % step) + step) % step; // 0..step
      const down = current - remainder;
      const up = down + step;
      const target = current - down < up - current ? down : up;
      animate(rotation, target, { type: "spring", stiffness: 120, damping: 20 });
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center overflow-visible py-8">
      <div
        className="relative h-[min(70vh,540px)] w-full touch-pan-y select-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="region"
        aria-label="Rolling movie deck carousel"
      >
        {/* Center anchor */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2" />

        {items.map((movie, i) => {
          const baseAngle = i * step;
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
