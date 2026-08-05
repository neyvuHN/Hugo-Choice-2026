import React from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';

interface ProcessModalScreenProps {
  onProceed: () => void;
}

export const ProcessModalScreen: React.FC<ProcessModalScreenProps> = ({ onProceed }) => {
  const handleProceed = () => {
    soundFx.playSelect();
    onProceed();
  };

  return (
    <div className="relative flex-1 flex items-center justify-center w-full min-h-[80vh] px-4 py-8">
      {/* Decorative Butterflies on Card Edge */}
      <div className="absolute top-12 left-6 md:left-24 z-30 animate-float-slow">
        <ButterflyParticle type="white" size={56} />
      </div>
      <div className="absolute bottom-16 right-6 md:right-24 z-30 animate-float-slow delay-500">
        <ButterflyParticle type="white" size={60} />
      </div>

      {/* Main Glassmorphism Process Card */}
      <div className="relative w-full max-w-2xl p-6 sm:p-10 md:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center text-white z-20 my-auto">

        {/* Title */}
        <h2 className="font-serif-display text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-2">
          HUGO AWARDS 2026
        </h2>

        {/* Round 2 Status Ribbon */}
        <div className="relative inline-flex items-center justify-center px-8 py-1.5 mb-8">
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
          >
            <polygon
              points="14,0 186,0 200,20 186,40 14,40 0,20"
              className="fill-amber-300/20 stroke-amber-300/80"
              strokeWidth="1.5"
            />
          </svg>
          <span className="relative z-10 font-serif-display text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Round 2 • Final Vote
          </span>
        </div>

        {/* Award Categories - Vertical List (One row per category with Glassmorphism) */}
        <div className="mb-8 w-full max-w-lg space-y-3">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-amber-300 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Award Categories
          </h3>

          <div className="space-y-2.5">
            <div className="py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] text-center">
              <span className="font-extrabold text-sm sm:text-base text-amber-200 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Best Member
              </span>
            </div>

            <div className="py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] text-center">
              <span className="font-extrabold text-sm sm:text-base text-amber-200 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                The Perfect Duo
              </span>
            </div>

            <div className="py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] text-center">
              <span className="font-extrabold text-sm sm:text-base text-amber-200 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Rookie Of The Year
              </span>
            </div>

            <div className="py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] text-center">
              <span className="font-extrabold text-sm sm:text-base text-amber-200 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Best Event
              </span>
            </div>

            <div className="py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] text-center">
              <span className="font-extrabold text-sm sm:text-base text-amber-200 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Best Collaborator (Only for Staff)
              </span>
            </div>
          </div>
        </div>

        {/* Timeline & Voting Rules Glass Card */}
        <div className="mb-8 w-full max-w-lg space-y-3">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-amber-300 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Timeline & Rules
          </h3>

          <ul className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed space-y-2.5 text-left bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-lg">
            <li className="flex justify-between items-center border-b border-white/15 pb-2 opacity-60">
              <span className="font-bold text-slate-400">Round 1: Nominations</span>
              <span className="font-mono text-slate-500 text-xs">August 1st - August 4th</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/15 pb-2">
              <span className="font-bold text-amber-200">Round 2: Final Vote</span>
              <span className="font-mono text-amber-100 text-xs">August 5th - August 7th</span>
            </li>
            <li className="pt-1 text-slate-100 font-normal leading-normal">
              <span className="font-semibold text-amber-200">Voting Requirement:</span> Select exactly 2 nominees per category in Round 2.
            </li>
          </ul>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="group relative px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base tracking-widest uppercase shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>Got It!</span>
        </button>
      </div>
    </div>
  );
};
