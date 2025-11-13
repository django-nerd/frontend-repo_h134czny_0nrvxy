import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieCard from "./components/MovieCard";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${API_BASE}/api/movies`);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,#1f2a44_0%,transparent_40%),radial-gradient(900px_600px_at_110%_10%,#2a174f_0%,transparent_40%),linear-gradient(180deg,#0b1020_0%,#0a0f1e_60%,#070b17_100%)] text-white">
      {/* Top aura */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="bg-gradient-to-r from-cyan-200 via-indigo-200 to-fuchsia-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl"
          >
            CineCards
          </motion.h1>
          <div className="rounded-full bg-white/5 px-3 py-1 text-sm text-cyan-100 ring-1 ring-white/10">
            Blue/Purple Deck
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-300/80">
          A card‑game inspired board showcasing cinematic hits. Hover, tilt, and click a card to jump to the trailer.
        </p>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-800/30 ring-1 ring-white/10" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {movies.map((m, idx) => (
              <MovieCard key={m.id} movie={m} index={idx} />
            ))}
          </motion.div>
        )}
      </main>

      {/* Bottom glow */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[-20%] -z-10 h-[40vh] bg-gradient-to-t from-indigo-600/20 via-fuchsia-600/10 to-transparent blur-3xl" />
    </div>
  );
}
