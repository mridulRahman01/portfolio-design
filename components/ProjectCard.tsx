'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  title:    string;
  category: string;
  desc:     string;
  result:   string;
  color:    string;
}

export function ProjectCard({ title, category, desc, result, color }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${color}14, transparent 65%)` }}
      />

      {/* Border accent (bottom edge, glows on hover) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      <div className="relative z-10 p-8">
        {/* Category */}
        <span
          className="font-mono text-[11px] tracking-[0.4em] uppercase mb-4 block"
          style={{ color }}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-8">
          {desc}
        </p>

        {/* Key result */}
        <div
          className="text-2xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {result}
        </div>
      </div>

      {/* Hover border colour change — done via box-shadow so it doesn't shift layout */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}
        whileHover={{ boxShadow: `0 0 0 1px ${color}30, 0 0 40px ${color}08` }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}
