import React, { useState, useEffect } from 'react';
import { ROUND2_ROOKIES, Round2Candidate } from '../../data/round2Data';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedNomineesPanel } from '../SelectedNomineesPanel';
import { toast } from '../../utils/toast';

interface RookieScreenProps {
  selectedRookieIds: string[];
  userTeam?: HugoTeam | null;
  userName?: string;
  onSelectRookies: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onNavigate?: (step: any) => void;
}

const TEAM_TEXT_COLORS: Record<string, string> = {
  hc: 'text-blue-300 group-hover:text-blue-200',
  prs: 'text-red-400 group-hover:text-red-350',
  bnn: 'text-yellow-300 group-hover:text-yellow-200',
  niff: 'text-purple-300 group-hover:text-purple-200'
};

export const RookieScreen: React.FC<RookieScreenProps> = ({
  selectedRookieIds = [],
  userTeam = null,
  userName,
  onSelectRookies,
  onBack,
  onNext,
  onNavigate
}) => {
  const selectedList = Array.isArray(selectedRookieIds) ? selectedRookieIds : (selectedRookieIds ? [selectedRookieIds] : []);

  // Self-heal: filter out old/invalid nominees from previous rounds
  useEffect(() => {
    const validSelected = selectedList.filter(id =>
      ROUND2_ROOKIES.some(c => c.name === id || c.id === id)
    );
    if (selectedList.length !== validSelected.length) {
      onSelectRookies(validSelected);
    }
  }, [selectedRookieIds]);

  const handleSelect = (candidate: Round2Candidate) => {
    const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);

    soundFx.playNomineeClick();
    if (isSelected) {
      // Deselect if clicking the already-selected item
      onSelectRookies([]);
    } else {
      // Directly replace any existing selection
      onSelectRookies([candidate.name]);
    }
  };

  const isComplete = selectedList.length === 1;

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-24 select-none">
      {/* Title & Header Description - Left-aligned */}
      <div className="text-left mb-6 shrink-0 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/75 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-2 shadow-lg backdrop-blur-md">
          <span>CATEGORY 3</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          The Rookie
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200/90 font-bold mt-1.5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring outstanding newcomers who joined this term. Exactly 1 selection required.
        </p>
      </div>

      {/* Main Options List Container - Left Aligned + Right Panel for Selected Cards */}
      <div className="relative flex-1 flex flex-col justify-center min-h-0 max-w-5xl mx-auto w-full py-2">
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          {/* Left panel: option list with green glass styling */}
          <div className="flex flex-col gap-3.5 w-full md:max-w-[340px] shrink-0">
            {ROUND2_ROOKIES.map((candidate) => {
              const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);
              const teamColorClass = candidate.teamId ? (TEAM_TEXT_COLORS[candidate.teamId] || 'text-rose-200/80') : 'text-rose-200/80';

              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => handleSelect(candidate)}
                  className={`w-full py-4 px-6 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between group border text-left ${
                    isSelected
                      ? 'bg-emerald-500/35 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35),inset_0_0_15px_rgba(16,185,129,0.1)] scale-[1.01]'
                      : 'bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-300/15 hover:border-emerald-400/40 shadow-lg backdrop-blur-md'
                  }`}
                >
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-serif-display font-black text-base sm:text-lg tracking-wide leading-snug text-white text-left">
                      {candidate.name}
                    </span>
                    {candidate.teamName && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors text-left ${teamColorClass}`}>
                        {candidate.teamName}
                      </span>
                    )}
                  </div>
                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md font-black text-xs border border-emerald-300 ml-2">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-emerald-300/30 group-hover:border-emerald-300/60 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right panel: floating webm preview */}
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <SelectedNomineesPanel
              selectedKeys={selectedList}
              candidates={ROUND2_ROOKIES}
              placeholderText="Select 1 rookie"
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center pt-3 border-t border-white/10 shrink-0 mt-6">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border-2 border-white/90 bg-black/70 hover:bg-black/90 text-white font-serif-display text-sm sm:text-base font-bold flex items-center gap-1 cursor-pointer transition-all shadow-lg active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <PaginationFooter currentStep="rookie" onNavigate={onNavigate || (() => { })} />

        <button
          type="button"
          onClick={() => {
            if (selectedList.length < 1) {
              toast.warning(`Please select exactly 1 candidate before proceeding (${selectedList.length}/1 selected)`);
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border-2 border-white/90 font-serif-display text-sm sm:text-base font-black flex items-center gap-1 cursor-pointer transition-all shadow-lg active:scale-95 ${isComplete
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-102 border-amber-300'
            : 'bg-white/20 border-white/10 text-gray-400 opacity-60'
            }`}
        >
          <span>Next ({selectedList.length}/1)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
