import React from 'react';

interface EventInfoPanelProps {
  isOpen: boolean;
  infoRef: React.RefObject<HTMLDivElement | null>;
  userName?: string;
  onStartClick: () => void;
}

export const EventInfoPanel: React.FC<EventInfoPanelProps> = ({
  isOpen,
  infoRef,
  userName,
  onStartClick
}) => {
  return (
    <div
      ref={infoRef}
      className={`w-full overflow-hidden transition-all duration-500 ease-in-out scroll-mt-20 ${isOpen ? 'max-h-[1600px] opacity-100 mt-2 sm:mt-4' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
        }`}
    >
      <div className="relative rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/35 p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.3)] text-white text-left space-y-5 sm:space-y-6">
        {/* Header info note */}
        <div className="text-center pb-3 border-b border-white/20">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-300 block mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            About The 18th Edition
          </span>
          <h3 className="font-serif-display text-xl sm:text-3xl text-white font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Hugo Farewell & Awards 2026
          </h3>
        </div>

        {/* Introduction */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2.5 sm:space-y-3 font-sans-clean text-xs sm:text-base leading-relaxed text-white font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <p>
            The Hugo Awards are annual accolades presented during the Hugo Farewell event to honor and appreciate the incredible dedication, hard work, and efforts of all Hugo staff and members throughout the term.
          </p>
          <p>
            This 18th edition carries the theme <span className="font-extrabold text-amber-300 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">FLORESCENCE</span>—a celebration of blooming, thriving, and the spectacular growth of our young talents over the 2025-2026 term.
          </p>
          <p className="text-amber-200 font-semibold italic text-[11px] sm:text-sm pt-2 border-t border-white/20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            To honor this blooming season, we are officially opening the voting portal! The final results will be kept completely secret and revealed live at the Farewell event.
          </p>
        </div>

        {/* Award Categories */}
        <div>
          <h4 className="text-[12px] sm:text-sm font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-2.5 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            The Awards
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25">
              <h5 className="font-extrabold text-amber-200 text-sm sm:text-lg tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">Best Member</h5>
              <p className="text-xs sm:text-sm text-white font-medium mt-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Who is the MVP of your team? <span className="text-amber-100/90 font-normal">(Note: Each of the 4 teams will vote internally to crown their own Best Member, resulting in 4 winners total).</span>
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25">
              <h5 className="font-extrabold text-amber-200 text-sm sm:text-lg tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">The Perfect Duo</h5>
              <p className="text-xs sm:text-sm text-white font-medium mt-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                The ultimate Hugo pair whose chemistry and teamwork made every moment shine.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25">
              <h5 className="font-extrabold text-amber-200 text-sm sm:text-lg tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">Rookie Of The Year</h5>
              <p className="text-xs sm:text-sm text-white font-medium mt-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                The single most outstanding newcomer who truly shined this term (10/2025 - 8/2026). <span className="text-amber-100/90 font-normal">(Note: Must be a member who joined from October 2025; this is a club-wide vote).</span>
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25">
              <h5 className="font-extrabold text-amber-200 text-sm sm:text-lg tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">Best Event</h5>
              <p className="text-xs sm:text-sm text-white font-medium mt-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                The Hugo event that stole your heart and left you with the best memories this term.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 sm:col-span-2">
              <h5 className="font-extrabold text-amber-200 text-sm sm:text-lg tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">Best Collaborator</h5>
              <p className="text-xs sm:text-sm text-white font-medium mt-1 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                To recognize exceptional behind-the-scenes teamwork. <span className="text-amber-100/90 font-normal">(Note: This special award is voted on exclusively by the Hugo staff departments. It is listed here so everyone can cheer for the nominees!)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Voting Rules & Timeline */}
        <div>
          <h4 className="text-[12px] sm:text-sm font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-2.5 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            Voting Rules & Timeline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 opacity-60 backdrop-blur-md border border-white/10">
              <span className="text-[11px] sm:text-xs font-black text-slate-300 tracking-wider uppercase block mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Round 1: Nominations
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-bold font-mono block mb-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                August 1st - August 4th
              </span>
              <p className="text-xs sm:text-sm text-white/80 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                You can nominate up to 3 people/events that you think are worthy for each category. Feel free to boldly nominate yourself!
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-400/20 backdrop-blur-md border border-amber-300/40">
              <span className="text-[11px] sm:text-xs font-black text-amber-300 tracking-wider uppercase block mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Round 2: Final Vote
              </span>
              <span className="text-[11px] sm:text-xs text-amber-200 font-bold font-mono block mb-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                August 5th - August 7th
              </span>
              <p className="text-xs sm:text-sm text-white font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                The Top 5 nominees for each award will be revealed. During this round, you will cast your final votes for 2 people/events per category.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action inside panel */}
        <div className="pt-2 flex justify-center pb-2">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            {userName ? 'Proceed to Vote' : 'Log In & Start Voting'}
          </button>
        </div>
      </div>
    </div>
  );
};
