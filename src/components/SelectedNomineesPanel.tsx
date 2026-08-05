import React, { useState, useEffect } from 'react';
import { Round2Candidate } from '../data/round2Data';

interface SelectedNomineesPanelProps {
  selectedKeys: string[];
  candidates: Round2Candidate[];
  placeholderText?: string;
}

export const SelectedNomineesPanel: React.FC<SelectedNomineesPanelProps> = ({
  selectedKeys = [],
  candidates = [],
  placeholderText = "Please select 1 option"
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: string; top: string; size: string; delay: string; duration: string }>>([]);

  const selectedKeysStr = selectedKeys.join(',');

  // Find full objects for selected keys
  const selectedNominees = selectedKeys
    .map(key => candidates.find(c => c.id === key || c.name === key))
    .filter((c): c is Round2Candidate => !!c);

  // Generate magical sparkles whenever selected keys change
  useEffect(() => {
    if (selectedNominees.length > 0) {
      const newSparkles = Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 7 + 4}px`, // 4px to 11px
        delay: `${Math.random() * 2.5}s`,
        duration: `${Math.random() * 2 + 2}s` // 2s to 4s
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [selectedKeysStr]);

  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center p-4">
      {/* Styles for fairy dust animation & magical trails */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fairyDustSparkle {
          0% {
            transform: translateY(0) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 0.95;
          }
          70% {
            opacity: 0.95;
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.9));
          }
          100% {
            transform: translateY(-80px) scale(1.4) rotate(360deg);
            opacity: 0;
          }
        }
        .fairy-sparkle {
          animation: fairyDustSparkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }

        @keyframes magicSpinClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes magicSpinCounterClockwise {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        @keyframes floatInUp {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-float-in-up {
          animation: floatInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .magic-trail-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }
        .magic-trail-gold {
          background: conic-gradient(from 0deg, transparent 20%, rgba(251, 191, 36, 0.15) 50%, rgba(251, 191, 36, 0.65) 80%, #ffffff 100%);
          mask: radial-gradient(circle, transparent 78%, black 80%);
          -webkit-mask: radial-gradient(circle, transparent 78%, black 80%);
          animation: magicSpinClockwise 3.5s linear infinite;
        }
        .magic-trail-cyan {
          background: conic-gradient(from 180deg, transparent 20%, rgba(34, 211, 238, 0.15) 50%, rgba(34, 211, 238, 0.65) 80%, #ffffff 100%);
          mask: radial-gradient(circle, transparent 78%, black 80%);
          -webkit-mask: radial-gradient(circle, transparent 78%, black 80%);
          animation: magicSpinCounterClockwise 4.5s linear infinite;
        }
        .animate-spin-clockwise {
          animation: magicSpinClockwise 3.5s linear infinite;
        }
        .animate-spin-counter-clockwise {
          animation: magicSpinCounterClockwise 4.5s linear infinite;
        }
        .magic-trail-glow {
          filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 12px rgba(251, 191, 36, 0.4));
        }
        .magic-trail-glow-cyan {
          filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.4));
        }
      `}} />

      {/* Magical Sparkles Layer */}
      {selectedNominees.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {sparkles.map(sp => (
            <div
              key={sp.id}
              className="absolute bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 fairy-sparkle"
              style={{
                left: sp.left,
                top: sp.top,
                width: sp.size,
                height: sp.size,
                // Pass custom properties for the animation
                ['--duration' as any]: sp.duration,
                ['--delay' as any]: sp.delay,
              }}
            />
          ))}
        </div>
      )}

      {selectedNominees.length === 0 ? (
        // Empty State: Landscape/Horizontal White Glass Card
        <div className="flex flex-row items-center justify-center gap-4 text-left border border-dashed border-white/40 rounded-3xl p-5 sm:p-6 w-72 sm:w-96 h-28 sm:h-32 bg-white/10 backdrop-blur-md shadow-2xl animate-float-slow">
          <span className="text-3xl sm:text-4xl text-amber-300/80 animate-pulse shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">🏆</span>
          <p className="font-serif-display text-[10px] sm:text-xs font-black text-amber-200/90 leading-relaxed uppercase tracking-widest drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)] pr-2">
            {placeholderText}
          </p>
        </div>
      ) : selectedNominees.length === 1 ? (
        // 1 Item Selected: Centered large card
        <div className="flex items-center justify-center z-10 w-full">
          <SelectedCard key={selectedNominees[0].id} nominee={selectedNominees[0]} />
        </div>
      ) : (
        // 2 Items Selected: Side-by-side standing medals (separated)
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 items-center justify-center z-10 w-full max-w-2xl">
          <SelectedCard
            key={selectedNominees[0].id}
            nominee={selectedNominees[0]}
            style={{ animationDelay: '0s' }}
          />
          <SelectedCard
            key={selectedNominees[1].id}
            nominee={selectedNominees[1]}
            style={{ animationDelay: '-1.5s' }}
          />
        </div>
      )}
    </div>
  );
};

interface SelectedCardProps {
  nominee: Round2Candidate;
  className?: string;
  style?: React.CSSProperties;
}

const SelectedCard: React.FC<SelectedCardProps> = ({ nominee, className = '', style }) => {
  const isWebM = nominee.avatar.endsWith('.webm');

  return (
    <div
      className={`relative w-64 sm:w-72 md:w-80 lg:w-[22rem] aspect-[3/4] flex flex-col justify-center items-center select-none bg-transparent border-0 shadow-none z-10 animate-float-in-up ${className}`}
    >
      {/* Inner container for continuous float animation */}
      <div 
        className="animate-float-slow w-full h-full flex flex-col justify-center items-center" 
        style={style}
      >
        {/* Scale container to make images larger and reduce transparent padding margins */}
        <div className="relative w-full aspect-square flex items-center justify-center transform-style-3d scale-[1.45]">
          
          {/* Magic Trail 1 (Outer Gold) - Tilted 3D Orbit */}
          <div 
            className="absolute w-[86%] h-[86%] rounded-full pointer-events-none transform-style-3d magic-trail-glow"
            style={{ 
              transform: 'rotateY(30deg) rotateX(15deg)',
              zIndex: 5
            }}
          >
            {/* The rotating trail ring */}
            <div className="magic-trail-ring magic-trail-gold" />
            {/* The rotating head particle */}
            <div className="absolute inset-0 animate-spin-clockwise transform-style-3d">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#fbbf24,0_0_30px_#f59e0b] z-30" />
            </div>
          </div>

          {/* Magic Trail 2 (Inner Cyan) - Counter-Rotating Tilted 3D Orbit */}
          <div 
            className="absolute w-[78%] h-[78%] rounded-full pointer-events-none transform-style-3d magic-trail-glow-cyan"
            style={{ 
              transform: 'rotateY(-25deg) rotateX(20deg)',
              zIndex: 4
            }}
          >
            {/* The rotating trail ring */}
            <div className="magic-trail-ring magic-trail-cyan" />
            {/* The rotating head particle */}
            <div className="absolute inset-0 animate-spin-counter-clockwise transform-style-3d">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_#22d3ee,0_0_24px_#06b6d4] z-30" />
            </div>
          </div>

          {/* Media Content */}
          {isWebM ? (
            <video
              src={nominee.avatar}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-full overflow-hidden bg-transparent filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative z-10 transform-style-3d"
              style={{ transform: 'translateZ(0px)' }}
            />
          ) : (
            <div 
              className="relative w-[82%] h-[82%] rounded-full overflow-hidden border border-amber-300/30 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-end p-4 z-10 transform-style-3d"
              style={{ transform: 'translateZ(0px)' }}
            >
              <img
                src={nominee.avatar}
                alt={nominee.name}
                onError={(e) => {
                  e.currentTarget.src = nominee.teamLogo || '/assets/logo.png';
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
              
              {/* Display text overlay only for fallback images */}
              <div className="relative z-10 text-center w-full pb-2">
                <h4 className="font-serif-display text-xs sm:text-sm font-black text-amber-200 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight uppercase truncate">
                  {nominee.name}
                </h4>
                {nominee.teamName && (
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1 inline-block bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                    {nominee.teamName}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
