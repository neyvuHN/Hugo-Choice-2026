import React, { useState, useEffect } from 'react';
import { ROUND2_BEST_MEMBERS, Round2Candidate } from '../../data/round2Data';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedNomineesPanel } from '../SelectedNomineesPanel';
import { toast } from '../../utils/toast';

interface BestMemberScreenProps {
  selectedCandidateIds: string[];
  userTeam?: HugoTeam | null;
  userName?: string;
  onSelectCandidates: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onNavigate?: (step: any) => void;
}

const TEAM_BADGES: Record<HugoTeam, { name: string; shortName: string; bg: string; text: string; image: string }> = {
  prs: { name: 'Power Rangers', shortName: 'P.Rangers', bg: 'bg-red-500/30 border-red-400/60', text: 'text-red-200 font-bold', image: '/team_logo/POWER RANGERS.png' },
  hc: { name: 'Heroes Company', shortName: 'Heroes Co.', bg: 'bg-blue-500/30 border-blue-400/60', text: 'text-blue-200 font-bold', image: '/team_logo/Heroes.png' },
  bnn: { name: 'Banana', shortName: 'Banana', bg: 'bg-amber-500/30 border-amber-400/60', text: 'text-amber-200 font-bold', image: '/team_logo/BANANA.png' },
  niff: { name: 'Nifflers', shortName: 'Nifflers', bg: 'bg-purple-500/30 border-purple-400/60', text: 'text-purple-200 font-bold', image: '/team_logo/NIFFLER.png' }
};

const TEAM_TEXT_COLORS: Record<HugoTeam, string> = {
  hc: 'text-blue-300 group-hover:text-blue-200',
  prs: 'text-red-400 group-hover:text-red-355',
  bnn: 'text-yellow-300 group-hover:text-yellow-200',
  niff: 'text-purple-300 group-hover:text-purple-200'
};

export const BestMemberScreen: React.FC<BestMemberScreenProps> = ({
  selectedCandidateIds = [],
  userTeam = null,
  userName,
  onSelectCandidates,
  onBack,
  onNext,
  onNavigate
}) => {
  const selectedList = Array.isArray(selectedCandidateIds) ? selectedCandidateIds : (selectedCandidateIds ? [selectedCandidateIds] : []);

  const activeTeam: HugoTeam = userTeam || 'hc';
  const candidates = ROUND2_BEST_MEMBERS[activeTeam] || [];
  const teamBadge = TEAM_BADGES[activeTeam];

  // Self-heal: filter out old/invalid nominees from previous rounds
  useEffect(() => {
    const validSelected = selectedList.filter(id =>
      candidates.some(c => c.name === id || c.id === id)
    );
    if (selectedList.length !== validSelected.length) {
      onSelectCandidates(validSelected);
    }
  }, [selectedCandidateIds, candidates]);

  const handleSelect = (candidate: Round2Candidate) => {
    const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);

    if (isSelected) {
      soundFx.playNomineeClick();
      const nextList = selectedList.filter(item => item !== candidate.name && item !== candidate.id);
      onSelectCandidates(nextList);
    } else {
      if (selectedList.length >= 1) {
        toast.warning('You can only select exactly 1 candidate. Deselect your current choice first to change your choice.');
        return;
      }
      soundFx.playNomineeClick();
      onSelectCandidates([...selectedList, candidate.name]);
    }
  };

  const isComplete = selectedList.length === 1;

  // Retrieve team specific text color
  const teamColorClass = TEAM_TEXT_COLORS[activeTeam] || 'text-rose-200/80';

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-24 select-none">
      {/* Title & Header Description - Left-aligned */}
      <div className="text-left mb-6 shrink-0 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/75 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-2 shadow-lg backdrop-blur-md">
          <span>CATEGORY 1</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Best Member
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200/90 font-bold mt-1.5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring outstanding individual contributions within team <span className="text-amber-300 font-extrabold">{teamBadge.name}</span>. Exactly 1 selection required.
        </p>
      </div>

      {/* Main Options List Container - Left Aligned + Right Panel for Selected Cards */}
      <div className="relative flex-1 flex flex-col justify-center min-h-0 max-w-5xl mx-auto w-full py-2">
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          {/* Left panel: option list with green glass styling */}
          <div className="flex flex-col gap-3.5 w-full md:max-w-[340px] shrink-0">
            {candidates.map((candidate) => {
              const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);

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

          {/* Right panel: floating video/image card preview */}
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <SelectedNomineesPanel
              selectedKeys={selectedList}
              candidates={candidates}
              placeholderText={`Select 1 candidate from ${teamBadge.name}`}
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

        <PaginationFooter currentStep="best_member" onNavigate={onNavigate || (() => { })} />

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
