import React, { useState, useEffect } from 'react';
import { ROUND2_EVENTS, Round2Candidate } from '../../data/round2Data';
import { soundFx } from '../../utils/soundEffects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedNomineesPanel } from '../SelectedNomineesPanel';
import { toast } from '../../utils/toast';

interface BestEventScreenProps {
  selectedEventIds: string[];
  userName?: string;
  onSelectEvents: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onNavigate?: (step: any) => void;
}

export const BestEventScreen: React.FC<BestEventScreenProps> = ({
  selectedEventIds = [],
  userName,
  onSelectEvents,
  onBack,
  onNext,
  onNavigate
}) => {
  const selectedList = Array.isArray(selectedEventIds) ? selectedEventIds : (selectedEventIds ? [selectedEventIds] : []);

  // Self-heal: filter out old/invalid nominees from previous rounds
  useEffect(() => {
    const validSelected = selectedList.filter(id =>
      ROUND2_EVENTS.some(c => c.name === id || c.id === id)
    );
    if (selectedList.length !== validSelected.length) {
      onSelectEvents(validSelected);
    }
  }, [selectedEventIds]);

  const handleSelect = (candidate: Round2Candidate) => {
    const isSelected = selectedList.includes(candidate.name) || selectedList.includes(candidate.id);

    if (isSelected) {
      soundFx.playNomineeClick();
      const nextList = selectedList.filter(item => item !== candidate.name && item !== candidate.id);
      onSelectEvents(nextList);
    } else {
      if (selectedList.length >= 1) {
        toast.warning('You can only select exactly 1 event. Deselect your current choice first to change your choice.');
        return;
      }
      soundFx.playNomineeClick();
      onSelectEvents([...selectedList, candidate.id]);
    }
  };

  const isComplete = selectedList.length === 1;

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-24 select-none">
      {/* Header Info & Title - Left-aligned */}
      <div className="text-left mb-6 shrink-0 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/75 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-2 shadow-lg backdrop-blur-md">
          <span>CATEGORY 2</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Best Event
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200/90 font-bold mt-1.5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring the most impactful event or activity series of the term. Exactly 1 selection required.
        </p>
      </div>

      {/* Main Options List Container - Left Aligned + Right Panel for Selected Cards */}
      <div className="relative flex-1 flex flex-col justify-center min-h-0 max-w-5xl mx-auto w-full py-2">
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          {/* Left panel: option list with green glass styling */}
          <div className="flex flex-col gap-3.5 w-full md:max-w-[340px] shrink-0">
            {ROUND2_EVENTS.map((event) => {
              const isSelected = selectedList.includes(event.id) || selectedList.includes(event.name);

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleSelect(event)}
                  className={`w-full py-3.5 px-5.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between group border ${
                    isSelected
                      ? 'bg-emerald-500/35 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35),inset_0_0_15px_rgba(16,185,129,0.1)] scale-[1.01]'
                      : 'bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-300/15 hover:border-emerald-400/40 shadow-lg backdrop-blur-md'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-serif-display font-black text-sm sm:text-base tracking-wide leading-snug text-white line-clamp-2">
                      {event.icon} {event.name}
                    </span>
                    {event.tag && (
                      <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest mt-0.5 group-hover:text-emerald-250 transition-colors truncate">
                        {event.tag}
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
              candidates={ROUND2_EVENTS}
              placeholderText="Select 1 event"
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

        <PaginationFooter currentStep="best_event" onNavigate={onNavigate || (() => { })} />

        <button
          type="button"
          onClick={() => {
            if (selectedList.length < 1) {
              toast.warning(`Please select exactly 1 event before proceeding (${selectedList.length}/1 selected)`);
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
