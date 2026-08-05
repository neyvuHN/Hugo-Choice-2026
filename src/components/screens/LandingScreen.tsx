import React, { useState, useRef } from 'react';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { EventInfoPanel } from '../EventInfoPanel';

interface LandingScreenProps {
  userName?: string;
  onStart: () => void;
  onRequireLogin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ userName, onStart, onRequireLogin }) => {
  const [isFlyingToLogin, setIsFlyingToLogin] = useState(false);
  const [loginPos, setLoginPos] = useState({ x: 0, y: 0 });
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleStartClick = () => {
    soundFx.playSelect();
    if (!userName) {
      const loginBtn = document.getElementById('header-login-button');
      if (loginBtn) {
        const rect = loginBtn.getBoundingClientRect();
        setLoginPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
      setIsFlyingToLogin(true);
      setTimeout(() => {
        setIsFlyingToLogin(false);
        onRequireLogin();
      }, 2500);
      return;
    }
    onStart();
  };

  const toggleInfo = () => {
    soundFx.playPaperSlide();
    const nextState = !isInfoOpen;
    setIsInfoOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[80vh] px-3 sm:px-4 py-6 sm:py-8 select-none">
      {/* Animated Flying Butterfly to Header Login */}
      {isFlyingToLogin && (
        <div
          className="animate-fly-to-login-dynamic"
          style={{
            '--target-x': loginPos.x ? `${loginPos.x}px` : 'calc(100% - 90px)',
            '--target-y': loginPos.y ? `${loginPos.y}px` : '24px'
          } as React.CSSProperties}
        >
          <img
            src="/assets/hope_butterfly.webp"
            alt="Flying Hope Butterfly"
            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(96,165,250,0.9)] animate-flutter-fast"
          />
        </div>
      )}

      {/* Main Landing Content Container */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full px-2 sm:px-4">
        {/* Top Header Tagline: The 18th Hugo Awards */}
        <div className="flex items-center justify-center gap-2.5 text-amber-100/90 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span>The 18th Hugo Awards</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
        </div>

        {/* Round 1 Status Ribbon Banner with Crisp Pointed Border */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-amber-200/50 to-amber-300/80" />
          
          <div className="relative inline-flex items-center justify-center px-8 sm:px-10 py-1.5">
            {/* Background SVG Ribbon Shape with Golden Border */}
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

            {/* Banner Text */}
            <div className="relative z-10 flex items-center gap-2 text-amber-200 font-serif-display text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              <span>Round 2 • Final Vote</span>
            </div>
          </div>

          <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-amber-200/50 to-amber-300/80" />
        </div>

        {/* Main Title: Hugo Awards 2026 */}
        <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-200 tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] mb-2">
          Hugo Awards 2026
        </h1>

        {/* Theme Title: Florescence */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-200/60" />
          <span className="font-script text-3xl sm:text-5xl md:text-6xl text-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide">
            Florescence
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-200/60" />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-4 sm:mb-6 w-full max-w-xs sm:max-w-none">
          <button
            onClick={toggleInfo}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-6 sm:px-9 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white font-sans-clean font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-amber-200/60 cursor-pointer"
          >
            <span>{isInfoOpen ? 'Hide Event Info' : 'Explore Event Info'}</span>
            <svg
              className={`w-4 h-4 text-amber-200 transition-transform duration-300 ${isInfoOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={handleStartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 font-sans-clean font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{userName ? 'Start Voting' : 'Log In & Vote'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Modular Event Info Sub-Component */}
        <EventInfoPanel
          isOpen={isInfoOpen}
          infoRef={infoRef}
          userName={userName}
          onStartClick={handleStartClick}
        />

        {/* Decorative Floating Butterfly Details */}
        <div className="absolute -top-6 -left-8 sm:-left-16 z-10 pointer-events-none animate-float-slow">
          <img
            src="/assets/butterfly.webp"
            alt="Butterfly"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-80 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-flutter"
          />
        </div>
        <div className="absolute bottom-2 -right-4 sm:-right-12 z-10 pointer-events-none animate-float-slow delay-500">
          <ButterflyParticle type="white" size={24} />
        </div>
      </div>
    </div>
  );
};

