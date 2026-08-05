import React, { useState } from 'react';
import { BEST_EVENTS } from '../../data/mockData';
import { soundFx } from '../../utils/soundEffects';
import { Search, ChevronLeft, ChevronRight, Sparkles, Check, Plus, CheckCircle2, PlusCircle } from 'lucide-react';
import { PaginationFooter } from '../PaginationFooter';
import { SelectedTray } from '../SelectedTray';
import { requestAddEvent, getCustomEvents } from '../../utils/approvalStorage';
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
  const [searchQuery, setSearchQuery] = useState('');

  const selectedList = Array.isArray(selectedEventIds) ? selectedEventIds : (selectedEventIds ? [selectedEventIds] : []);

  const approvedCustomEvents = getCustomEvents();
  const allEventsList = [...BEST_EVENTS, ...approvedCustomEvents];
  const filteredEvents = searchQuery.trim()
    ? allEventsList.filter(e => e.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : allEventsList;

  const handleSelect = (id: string) => {
    soundFx.playSelect();
    if (selectedList.includes(id)) {
      onSelectEvents(selectedList.filter(eId => eId !== id));
    } else {
      if (selectedList.length >= 2) {
        return;
      }
      onSelectEvents([...selectedList, id]);
    }
  };

  const handleAddCustomEvent = () => {
    if (!searchQuery.trim()) return;
    requestAddEvent(searchQuery.trim(), userName || 'Guest');
    toast.success(`Request to add event "${searchQuery.trim()}" submitted! Admin will review it.`);
    setSearchQuery('');
  };

  const isComplete = selectedList.length === 2;
  const isSearchEmptyAndNoCustom = searchQuery.trim() && !filteredEvents.some(e => e.name.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full h-full min-h-0 py-3 sm:py-4 px-3 sm:px-6 overflow-y-auto custom-scrollbar pb-32 select-none">
      {/* Header Info & Title */}
      <div className="text-center mb-3 shrink-0 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/70 border border-amber-300/60 text-amber-300 text-xs sm:text-sm font-bold mb-1.5 shadow-lg backdrop-blur-md">
          <span>CATEGORY 2</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Best Event
        </h2>
        <p className="font-sans-clean text-xs sm:text-sm text-amber-200 font-bold mt-1 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Honoring the most impactful event or activity series of the term. Exactly 2 selections required.
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
            placeholder="Type event name to search..."
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

        {/* Event List Grid */}
        <div className="relative shrink-0 max-h-[320px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 items-start content-start custom-scrollbar mb-0">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const isSelected = selectedList.includes(event.id) || selectedList.includes(event.name);

              return (
                <button
                  key={event.id}
                  onClick={() => handleSelect(event.id)}
                  className={`p-3.5 rounded-xl font-sans-clean transition-all duration-200 flex flex-col justify-between cursor-pointer border text-left min-h-[90px] ${isSelected
                    ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-[1.02]'
                    : 'bg-black/75 hover:bg-black/90 border-amber-300/40 text-white hover:border-amber-300/80 shadow-lg'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">{event.icon} {event.name}</div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 font-black text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <div className={`text-[0.68rem] sm:text-xs line-clamp-2 mt-1 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
                      {event.description}
                    </div>
                  )}
                </button>
              );
            })
          ) : isSearchEmptyAndNoCustom ? (
            <button
              type="button"
              onClick={handleAddCustomEvent}
              className="col-span-full py-8 px-4 text-center font-bold bg-amber-400/20 hover:bg-amber-400/30 border-2 border-dashed border-amber-300 rounded-xl text-amber-200 text-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
            >
              <Sparkles className="w-8 h-8 text-amber-300 animate-bounce" />
              <span>Add event "{searchQuery.trim()}" to database and select</span>
            </button>
          ) : (
            <div className="col-span-full py-10 text-center text-amber-200 font-bold bg-black/60 rounded-xl border border-amber-300/30 text-xs sm:text-sm">
              No matching event found.
            </div>
          )}
        </div>

        {/* Selected Events Placement Bar at Bottom (Reusable Light Glass Tray) */}
        <SelectedTray
          title="Selected Events"
          maxItems={2}
          items={[0, 1].map(idx => {
            const selectedId = selectedList[idx];
            const eventObj = selectedId ? allEventsList.find(e => e.id === selectedId || e.name === selectedId) : null;
            return eventObj ? { id: eventObj.id, name: eventObj.name, subLabel: eventObj.icon } : null;
          })}
          onRemove={(item) => {
            handleSelect(item.id);
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

        <PaginationFooter currentStep="best_event" onNavigate={onNavigate || (() => { })} />

        <button
          type="button"
          onClick={() => {
            if (selectedList.length < 2) {
              toast.warning(`Please select 2 events before proceeding (${selectedList.length}/2 selected)`);
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
