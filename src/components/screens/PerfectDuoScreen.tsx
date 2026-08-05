import React, { useState, useEffect } from 'react';
import { ROUND2_DUOS, Round2Candidate } from '../../data/round2Data';
import { soundFx } from '../../utils/soundEffects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedNomineesPanel } from '../SelectedNomineesPanel';
import { toast } from '../../utils/toast';

interface PerfectDuoScreenProps {
  selectedDuoIds: string[];
  userName?: string;
  onSelectDuos: (duos: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onNavigate?: (step: any) => void;
}

const getDuoTeamColorClass = (duoId: string) => {
  if (duoId === 'duo-1') return 'text-red-400 group-hover:text-red-300';
  if (duoId === 'duo-2') return 'text-purple-300 group-hover:text-purple-200';
  if (duoId === 'duo-3') return 'text-blue-300 group-hover:text-blue-200';
  if (duoId === 'duo-4') return 'text-red-400 group-hover:text-red-300';
  return 'text-rose-200/80';
};

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoIds = [],
  userName,
  onSelectDuos,
  onBack,
  onNext,
  onNavigate
}) => {
  const selectedList = Array.isArray(selectedDuoIds) ? selectedDuoIds : (selectedDuoIds ? [selectedDuoIds] : []);

  // Self-heal: filter out old/invalid nominees from previous rounds
  useEffect(() => {
    const validSelected = selectedList.filter(id =>
      ROUND2_DUOS.some(c => c.name === id || c.id === id)
    );
    if (selectedList.length !== validSelected.length) {
      onSelectDuos(validSelected);
    }
  }, [selectedDuoIds]);

  const handleSelect = (candidate: Round2Candidate) => {
    const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);

    if (isSelected) {
      soundFx.playNomineeClick();
      const nextList = selectedList.filter(item => item !== candidate.name && item !== candidate.id);
      onSelectDuos(nextList);
    } else {
      if (selectedList.length >= 1) {
        toast.warning('You can only select exactly 1 duo pair. Deselect your current choice first to change your choice.');
        return;
      }
      soundFx.playNomineeClick();
      onSelectDuos([...selectedList, candidate.name]);
    }
  };

  const isComplete = selectedList.length === 1;

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-24 select-none">
      {/* Header Description - Left-aligned */}
      <div className="text-left mb-6 shrink-0 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/75 border border-amber-300/60 text-amber-350 text-xs sm:text-sm font-bold mb-2 shadow-lg backdrop-blur-md">
          <span>CATEGORY 4</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          The Perfect Duo
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200/90 font-bold mt-1.5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring seamless synergy, friendship, and chemistry. Exactly 1 pair required.
        </p>
      </div>

      {/* Main Options List Container - Left Aligned + Right Panel for Selected Cards */}
      <div className="relative flex-1 flex flex-col justify-center min-h-0 max-w-5xl mx-auto w-full py-2">
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          {/* Left panel: option list with green glass styling */}
          <div className="flex flex-col gap-3.5 w-full md:max-w-[340px] shrink-0">
            {ROUND2_DUOS.map((duo) => {
              const isSelected = selectedList.includes(duo.name) || selectedList.includes(duo.id);

              return (
                <button
                  key={duo.id}
                  type="button"
                  onClick={() => handleSelect(duo)}
                  className={`w-full py-3.5 px-5.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between group border ${
                    isSelected
                      ? 'bg-emerald-500/35 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35),inset_0_0_15px_rgba(16,185,129,0.1)] scale-[1.01]'
                      : 'bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-300/15 hover:border-emerald-400/40 shadow-lg backdrop-blur-md'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-serif-display font-black text-sm sm:text-base tracking-wide leading-snug text-white line-clamp-2">
                      {duo.name}
                    </span>
                    {duo.id === 'duo-5' ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors">
                        <span className="text-purple-300 group-hover:text-purple-200">Nifflers</span>
                        <span className="text-rose-200/80"> & </span>
                        <span className="text-blue-300 group-hover:text-blue-200">Heroes Company</span>
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${getDuoTeamColorClass(duo.id)}`}>
                        {duo.teamName}
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
              candidates={ROUND2_DUOS}
              placeholderText="Select 1 duo pair"
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

        <PaginationFooter currentStep="perfect_duo" onNavigate={onNavigate || (() => { })} />

        <button
          type="button"
          onClick={() => {
            if (selectedList.length < 1) {
              toast.warning(`Please select exactly 1 duo before proceeding (${selectedList.length}/1 selected)`);
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
