import React from 'react';
import { motion } from 'motion/react';

interface FloatingCandidateProps {
  name: string;
  avatar: string;
  teamLogo?: string;
  teamName?: string;
  onComplete: () => void;
}

export const FloatingCandidate: React.FC<FloatingCandidateProps> = ({
  name,
  avatar,
  teamLogo,
  teamName,
  onComplete
}) => {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0, scale: 0.6, rotate: -8, x: '-50%' }}
      animate={{
        y: '-35vh',
        opacity: [0, 1, 1, 0],
        scale: [0.6, 1.05, 1.05, 0.85],
        rotate: [-8, 6, 6, -4],
      }}
      transition={{
        duration: 3.5,
        times: [0, 0.12, 0.88, 1],
        ease: 'easeInOut',
      }}
      onAnimationComplete={onComplete}
      className="fixed left-1/2 bottom-0 z-50 pointer-events-none w-68 sm:w-80 font-sans-clean"
    >
      <div className="bg-black/60 backdrop-blur-2xl border border-amber-300/50 rounded-[2rem] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col items-center gap-3">
        {/* Profile/Option Image Card */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
          <img
            src={avatar}
            alt={name}
            onError={(e) => {
              // Fallback to team logo or placeholder
              e.currentTarget.src = teamLogo || '/assets/logo.png';
            }}
            className="w-full h-full object-cover"
          />
          {/* Elegant gold/dark vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Subtle gold sparkles on top */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 backdrop-blur-sm text-[0.6rem] font-bold text-amber-300 uppercase tracking-widest">
            Nominee
          </div>
        </div>

        {/* Info Area */}
        <div className="text-center w-full pb-1">
          <h3 className="font-serif-display text-lg sm:text-xl font-black text-amber-200 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-tight uppercase">
            {name}
          </h3>
          {teamName && (
            <div className="inline-flex items-center gap-1.5 mt-1.5 text-[0.65rem] sm:text-xs font-bold text-amber-100 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {teamLogo && (
                <img src={teamLogo} alt={teamName} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
              )}
              <span>{teamName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
