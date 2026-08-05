import React, { useState } from 'react';
import { filterMembers, addCustomMember, ClubMember, getAllMembers } from '../../data/membersData';
import { HugoTeam } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { Search, UserCheck, Plus, ChevronLeft, ChevronRight, CheckCircle2, UserPlus } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedTray, SelectedTrayItem } from '../SelectedTray';
import { requestAddMember } from '../../utils/approvalStorage';
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

export const BestMemberScreen: React.FC<BestMemberScreenProps> = ({
  selectedCandidateIds = [],
  userTeam = null,
  userName,
  onSelectCandidates,
  onBack,
  onNext,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const targetTeam: HugoTeam | 'all' = userTeam || 'all';

  const selectedList = Array.isArray(selectedCandidateIds) ? selectedCandidateIds : (selectedCandidateIds ? [selectedCandidateIds] : []);
  const allMembers = getAllMembers();
  const filteredList = filterMembers(searchQuery, targetTeam);

  const handleSelectMember = (member: ClubMember) => {
    soundFx.playSelect();
    if (selectedList.includes(member.id) || selectedList.includes(member.name)) {
      const nextList = selectedList.filter(id => id !== member.id && id !== member.name);
      onSelectCandidates(nextList);
    } else {
      if (selectedList.length >= 2) {
        return;
      }
      onSelectCandidates([...selectedList, member.id]);
    }
  };

  const handleAddCustom = () => {
    if (!searchQuery.trim()) return;
    requestAddMember(searchQuery.trim(), userTeam || 'prs', userName || 'Guest');
    toast.success(`Request to add "${searchQuery.trim()}" submitted! Admin will review it.`);
    setSearchQuery('');
  };

  const isComplete = selectedList.length === 2;
  const isSearchEmptyAndNoCustom = searchQuery.trim() && !filteredList.some(m => m.name.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-32 select-none">
      {/* Title & Header Description */}
      <div className="text-center mb-3 shrink-0 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/70 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-1.5 shadow-lg backdrop-blur-md">
          <span>CATEGORY 1</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Best Member
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200 font-bold mt-1 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring outstanding individual contributions within the team. Exactly 2 selections required.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full py-1">
        {/* Full-width Standalone Search Bar */}
        <div className="relative w-full mb-3 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type member name to search..."
            className="w-full py-3.5 pl-12 pr-10 rounded-2xl bg-black/85 text-white placeholder-slate-400 font-sans-clean text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-300/50 shadow-2xl backdrop-blur-xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold bg-white/10 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Member Search Results Grid */}
        <div className="relative shrink-0 max-h-[320px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 items-start content-start custom-scrollbar mb-0">
          {filteredList.length > 0 ? (
            filteredList.map((member) => {
              const isSelected = selectedList.includes(member.id) || selectedList.includes(member.name);
              const badge = TEAM_BADGES[member.teamId];

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className={`p-3.5 rounded-xl font-sans-clean transition-all duration-200 flex items-center justify-between cursor-pointer border text-left ${isSelected
                    ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-[1.02]'
                    : 'bg-black/75 hover:bg-black/90 border-amber-300/40 text-white hover:border-amber-300/80 shadow-lg'
                    }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                    <UserCheck className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-300'}`} />
                    <div className="truncate min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate leading-snug">{member.name}</div>
                      <div className={`text-[0.65rem] sm:text-xs inline-flex items-center gap-1 ${isSelected ? 'text-slate-900 font-extrabold' : badge.text}`}>
                        <img src={badge.image} alt={badge.name} className="w-3.5 h-3.5 object-contain rounded-full shrink-0" />
                        <span className="truncate">{badge.shortName}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 ml-1 font-black text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })
          ) : isSearchEmptyAndNoCustom ? (
            <button
              type="button"
              onClick={handleAddCustom}
              className="col-span-full py-8 px-4 text-center font-bold bg-amber-400/20 hover:bg-amber-400/30 border-2 border-dashed border-amber-300 rounded-xl text-amber-200 text-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
            >
              <UserPlus className="w-8 h-8 text-amber-300 animate-bounce" />
              <span>Add member "{searchQuery.trim()}" to database and select</span>
            </button>
          ) : (
            <div className="col-span-full py-10 text-center text-amber-200 font-bold bg-black/60 rounded-xl border border-amber-300/30 text-xs sm:text-sm">
              No matching member found.
            </div>
          )}
        </div>

        {/* Selected Candidates Placement Bar at Bottom (Reusable Light Glass Tray) */}
        <SelectedTray
          title="Selected Candidates"
          maxItems={2}
          items={[0, 1].map(idx => {
            const selectedId = selectedList[idx];
            const memObj = selectedId ? allMembers.find(m => m.id === selectedId || m.name === selectedId) : null;
            return memObj ? { id: memObj.id, name: memObj.name } : null;
          })}
          onRemove={(item) => {
            const memObj = allMembers.find(m => m.id === item.id || m.name === item.name);
            if (memObj) handleSelectMember(memObj);
          }}
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

        <PaginationFooter currentStep="best_member" onNavigate={onNavigate || (() => { })} />

        <button
          type="button"
          onClick={() => {
            if (selectedList.length < 2) {
              toast.warning(`Please select 2 candidates before proceeding (${selectedList.length}/2 selected)`);
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
          <span>Next ({selectedList.length}/2)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
