import React, { useState } from 'react';
import { filterMembers, ClubMember, getAllMembers } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Search, UserCheck, Plus, ChevronLeft, ChevronRight, Users, CheckCircle2, UserPlus } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedTray } from '../SelectedTray';
import { requestAddMember } from '../../utils/approvalStorage';
import { toast } from '../../utils/toast';

interface PerfectDuoScreenProps {
  selectedDuoIds: string[];
  userName?: string;
  onSelectDuos: (duos: string[]) => void;
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

interface SingleMemberPickerProps {
  title: string;
  selectedId: string;
  otherSelectedId?: string;
  userName?: string;
  onSelect: (m: ClubMember) => void;
}

const SingleMemberPicker: React.FC<SingleMemberPickerProps> = ({
  title,
  selectedId,
  otherSelectedId,
  userName,
  onSelect
}) => {
  const [search, setSearch] = useState('');
  const allMembers = getAllMembers();
  const list = filterMembers(search);

  const handleAddCustom = () => {
    if (!search.trim()) return;
    requestAddMember(search.trim(), 'prs', userName || 'Guest');
    toast.success(`Request to add "${search.trim()}" submitted! Admin will review it.`);
    setSearch('');
  };

  const isSearchEmptyAndNoCustom = search.trim() && !list.some(m => m.name.toLowerCase() === search.trim().toLowerCase());

  return (
    <div className="flex flex-col bg-black/85 p-3.5 rounded-2xl border border-amber-300/50 backdrop-blur-2xl min-h-0 h-full shadow-2xl">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-amber-300" />
          {title}
        </span>
        {selectedId && (
          <span className="text-[0.65rem] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-black">
            ✓ Selected
          </span>
        )}
      </div>

      <div className="relative mb-2 shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Type to search ${title}...`}
          className="w-full py-2 pl-9 pr-3 rounded-xl bg-gray-950/90 text-white placeholder-slate-400 font-sans-clean text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-300/40"
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-300 pointer-events-none" />
      </div>

      <div className="flex-1 min-h-[150px] max-h-[200px] overflow-y-auto pr-1 grid grid-cols-1 gap-1.5 items-start content-start custom-scrollbar">
        {list.length > 0 ? (
          list.map(member => {
            const isSelected = selectedId === member.id || selectedId === member.name;
            const isOtherSelected = !!otherSelectedId && (otherSelectedId === member.id || otherSelectedId === member.name);
            const badge = TEAM_BADGES[member.teamId];

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  if (isOtherSelected) return;
                  soundFx.playSelect();
                  onSelect(member);
                }}
                disabled={isOtherSelected}
                className={`p-2.5 rounded-xl text-left font-sans-clean text-xs transition-all flex items-center justify-between border cursor-pointer ${isSelected
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-md'
                  : isOtherSelected
                    ? 'bg-black/40 border-amber-300/20 text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-black/60 hover:bg-black/90 border-amber-300/30 text-white hover:border-amber-300/70'
                  }`}
              >
                <div className="truncate flex items-center gap-1.5 font-bold">
                  <span className="truncate">{member.name}</span>
                  {isOtherSelected && (
                    <span className="text-[0.6rem] text-slate-400 italic shrink-0">(Chosen in pair)</span>
                  )}
                </div>
                <span className={`text-[0.65rem] shrink-0 ml-1 inline-flex items-center gap-1 font-bold ${isSelected ? 'text-slate-900' : badge.text}`}>
                  <img src={badge.image} alt={badge.name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                  <span>{badge.shortName}</span>
                </span>
              </button>
            );
          })
        ) : isSearchEmptyAndNoCustom ? (
          <button
            type="button"
            onClick={handleAddCustom}
            className="w-full py-4 px-2 text-center font-bold bg-amber-400/20 hover:bg-amber-400/30 border border-dashed border-amber-300 rounded-xl text-amber-200 text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <UserPlus className="w-5 h-5 text-amber-300 animate-bounce" />
            <span>Add "{search.trim()}" to database and select</span>
          </button>
        ) : (
          <div className="py-4 text-center text-amber-200/80 font-bold text-xs">No member found</div>
        )}
      </div>
    </div>
  );
};

export const PerfectDuoScreen: React.FC<PerfectDuoScreenProps> = ({
  selectedDuoIds = [],
  userName,
  onSelectDuos,
  onBack,
  onNext,
  onNavigate
}) => {
  const initialList = Array.isArray(selectedDuoIds) ? selectedDuoIds : (selectedDuoIds ? [selectedDuoIds] : []);
  const allMembers = getAllMembers();

  const [pairs, setPairs] = useState<Array<{ a: string; b: string }>>(() => {
    const list: Array<{ a: string; b: string }> = [
      { a: '', b: '' },
      { a: '', b: '' }
    ];
    initialList.forEach((str, idx) => {
      if (idx < 2) {
        const parts = str.split(/\s*&\s*/);
        list[idx] = { a: parts[0] || '', b: parts[1] || '' };
      }
    });
    return list;
  });

  const [activeSlot, setActiveSlot] = useState<number>(0);

  const handleSetPersonA = (m: ClubMember) => {
    const updated = [...pairs];
    updated[activeSlot] = { ...updated[activeSlot], a: m.id };
    if (updated[activeSlot].a === updated[activeSlot].b) {
      updated[activeSlot].b = '';
    }
    setPairs(updated);
    emitDuos(updated);
  };

  const handleSetPersonB = (m: ClubMember) => {
    const updated = [...pairs];
    updated[activeSlot] = { ...updated[activeSlot], b: m.id };
    if (updated[activeSlot].a === updated[activeSlot].b) {
      updated[activeSlot].a = '';
    }
    setPairs(updated);
    emitDuos(updated);
  };

  const emitDuos = (pList: Array<{ a: string; b: string }>) => {
    const formatted = pList
      .filter(p => p.a && p.b)
      .map(p => `${p.a} & ${p.b}`);
    onSelectDuos(formatted);
  };

  const validPairsCount = pairs.filter(p => p.a && p.b).length;
  const isComplete = validPairsCount === 2;
  const currentPair = pairs[activeSlot] || { a: '', b: '' };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-32 select-none">
      {/* Header Description */}
      <div className="text-center mb-3 shrink-0 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/70 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-1.5 shadow-lg backdrop-blur-md">
          <span>CATEGORY 4</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          The Perfect Duo
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200 font-bold mt-1 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring seamless synergy and chemistry. Exactly 2 pairs required.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full py-1">
        {/* Member Pickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0 mb-1 sm:mb-2">
          <SingleMemberPicker
            title={`Teammate #1 (Pair ${activeSlot + 1})`}
            selectedId={currentPair.a}
            otherSelectedId={currentPair.b}
            userName={userName}
            onSelect={handleSetPersonA}
          />
          <SingleMemberPicker
            title={`Teammate #2 (Pair ${activeSlot + 1})`}
            selectedId={currentPair.b}
            otherSelectedId={currentPair.a}
            userName={userName}
            onSelect={handleSetPersonB}
          />
        </div>

        {/* 3 Slot Tabs Bar placed at Bottom (Reusable Light Glass Tray) */}
        <SelectedTray
          title="Selected Duo Pairs"
          maxItems={2}
          activeSlotIndex={activeSlot}
          onSlotClick={(idx) => {
            soundFx.playClick();
            setActiveSlot(idx);
          }}
          customStatusText={`Complete ${2 - validPairsCount} more pairs`}
          items={[0, 1].map(slotIdx => {
            const pair = pairs[slotIdx];
            const memA = allMembers.find(m => m.id === pair.a || m.name === pair.a);
            const memB = allMembers.find(m => m.id === pair.b || m.name === pair.b);
            if (!memA && !memB) return null;
            return {
              id: `pair-${slotIdx}`,
              name: memA && memB ? `${memA.name} & ${memB.name}` : memA ? `${memA.name} & ...` : `... & ${memB.name}`
            };
          })}
        />
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center pt-3 border-t border-amber-300/40 shrink-0 mt-3">
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
            if (validPairsCount < 2) {
              toast.warning(`Please complete 2 pairs before proceeding (${validPairsCount}/2 completed)`);
              return;
            }
            soundFx.playSelect();
            onNext();
          }}
          className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border-2 border-white/90 font-serif-display text-sm sm:text-base font-black flex items-center gap-1 cursor-pointer transition-all shadow-lg active:scale-95 ${isComplete
            ? 'bg-amber-300 hover:bg-amber-200 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:scale-105'
            : 'bg-white/40 border-white/30 text-gray-800 opacity-60'
            }`}
        >
          <span>Next ({validPairsCount}/2 pairs)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
