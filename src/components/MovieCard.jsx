import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect } from "react";

export default function MovieCard({ movie, index }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const glow = useMotionValue(0);

  useEffect(() => {
    const controls = animate(glow, [0, 1, 0.4, 1], {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    });
    return () => controls.stop();
  }, [glow]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const centerX = card.left + card.width / 2;
    const centerY = card.top + card.height / 2;

    const percentX = (e.clientX - centerX) / (card.width / 2);
    const percentY = (e.clientY - centerY) / (card.height / 2);

    rotateX.set(-percentY * 8);
    rotateY.set(percentX * 10);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const shadowOpacity = useTransform(glow, [0, 1], [0.25, 0.6]);
  const ringOpacity = useTransform(glow, [0, 1], [0.2, 0.6]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 120, damping: 16 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => window.open(movie.url, "_blank", "noopener,noreferrer")}
        style={{ rotateX, rotateY, scale }}
        className="group relative cursor-pointer select-none rounded-2xl p-[2px]"
      >
        {/* Outer animated ring */}
        <motion.div
          style={{
            boxShadow: shadowOpacity.to(v => `0 15px 40px rgba(56, 189, 248, ${v})`),
            opacity: ringOpacity
          }}
          className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-cyan-400/60 via-indigo-500/60 to-fuchsia-500/60 blur-md"
        />

        {/* Card core */}
        <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),rgba(56,189,248,0.08)_40%,rgba(168,85,247,0.08)_70%,transparent_100%)] ring-1 ring-white/10 backdrop-blur-xl">
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Top gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/10 to-slate-950/70" />

            {/* Rating badge */}
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-cyan-200 ring-1 ring-white/10 backdrop-blur">
              <Star className="h-4 w-4 text-yellow-300" fill="#FDE047" />
              <span className="text-xs font-semibold tracking-wide">{movie.rating.toFixed(1)}</span>
            </div>

            {/* Shine sweep */}
            <div className="absolute -left-1/4 -top-1/4 h-[150%] w-1/2 -rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="space-y-2 p-4">
            <h3 className="line-clamp-1 bg-gradient-to-r from-cyan-200 to-indigo-300 bg-clip-text text-lg font-bold text-transparent">
              {movie.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-snug text-slate-300/90">
              {movie.description}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/40 px-3 py-1.5 text-sm font-semibold text-cyan-100 ring-1 ring-white/10 transition-all duration-300 group-hover:from-indigo-500/50 group-hover:to-fuchsia-500/50">
                Watch now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
