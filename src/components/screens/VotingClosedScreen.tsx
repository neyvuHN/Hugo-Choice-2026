import React from 'react';
import { Lock } from 'lucide-react';
import { ButterflyParticle } from '../ButterflyParticle';

interface VotingClosedScreenProps {}

export const VotingClosedScreen: React.FC<VotingClosedScreenProps> = () => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[80vh] px-3 sm:px-4 py-6 sm:py-8 select-none">
      
      {/* Background Decorative Butterfly Details */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none animate-float-slow opacity-60">
        <img
          src="/assets/butterfly.webp"
          alt="Butterfly"
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-75 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-flutter"
        />
      </div>
      <div className="absolute bottom-10 right-10 z-10 pointer-events-none animate-float-slow delay-500">
        <ButterflyParticle type="gold" size={24} />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto w-full px-4">
        
        {/* Top Header Tagline */}
        <div className="flex items-center justify-center gap-2.5 text-amber-100/90 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span>The 18th Hugo Awards</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
        </div>

        {/* Closed Ribbon Banner */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-amber-200/50 to-amber-300/80" />
          <div className="relative inline-flex items-center justify-center px-8 sm:px-10 py-1.5">
            <svg
              className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
            >
              <polygon
                points="14,0 186,0 200,20 186,40 14,40 0,20"
                className="fill-amber-300/15 stroke-amber-300/70"
                strokeWidth="1.5"
              />
            </svg>
            <div className="relative z-10 flex items-center gap-2 text-amber-200 font-serif-display text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              <span>Voting Closed</span>
            </div>
          </div>
          <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-amber-200/50 to-amber-300/80" />
        </div>

        {/* Lock Premium Widget */}
        <div className="relative mb-8 sm:mb-10 flex justify-center group">
          <div className="absolute inset-0 rounded-full bg-amber-400/15 blur-2xl scale-150 animate-pulse-glow" />
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/40 backdrop-blur-xl border border-amber-300/30 shadow-[inset_0_0_20px_rgba(251,191,36,0.15),0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:shadow-[inset_0_0_30px_rgba(251,191,36,0.25),0_10px_50px_rgba(251,191,36,0.2)]">
            <div className="absolute inset-2 rounded-full border-[0.5px] border-amber-100/10" />
            <Lock 
              strokeWidth={1.5}
              className="w-10 h-10 sm:w-12 sm:h-12 text-amber-200/90 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
        </div>

        {/* Title & Theme info */}
        <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-200 tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] mb-4">
          Hugo Awards 2026
        </h1>

        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-10">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-200/60" />
          <span className="font-script text-3xl sm:text-5xl text-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide">
            Florescence
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-200/60" />
        </div>

        {/* Premium Announcement Message Box */}
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl glass-panel-dark backdrop-blur-xl shadow-2xl mb-8 border border-amber-300/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          
          <h2 className="font-serif-display text-xl sm:text-2xl text-amber-300 mb-4 tracking-wider">
            Voting Period Has Ended
          </h2>
          
          <p className="font-sans-clean text-sm sm:text-base text-amber-50/90 leading-relaxed font-medium">
            The official voting phase for this round is now closed as we compile the final results. Thank you to everyone who participated and made their voices heard!
          </p>
          
          <div className="my-5 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
          
          <div className="flex items-center justify-center gap-2 text-amber-200/90 text-xs sm:text-sm font-sans-clean font-semibold tracking-widest uppercase animate-pulse">
            <span className="text-amber-400">✧</span>
            <span>Results coming soon</span>
            <span className="text-amber-400">✧</span>
          </div>
        </div>

      </div>
    </div>
  );
};
