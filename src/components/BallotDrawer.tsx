import React from 'react';
import { VotingState, ScreenStep } from '../types';
import { X, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import {
  getResolvedTeamName,
  getResolvedBestMemberName,
  getResolvedEventName,
  getResolvedRookieName,
  getResolvedDuoName
} from '../utils/ballotHelpers';

interface BallotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  votingState: VotingState;
  onNavigate: (step: ScreenStep) => void;
}

export const BallotDrawer: React.FC<BallotDrawerProps> = ({
  isOpen,
  onClose,
  votingState,
  onNavigate
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Voter Profile',
      value: votingState.userName || 'Not entered yet',
      step: 'name_input' as ScreenStep,
      filled: Boolean(votingState.userName)
    },
    {
      title: 'Voter Team',
      value: getResolvedTeamName(votingState.selectedTeam, 'Incomplete (Select Team)'),
      step: 'team_selection' as ScreenStep,
      filled: Boolean(votingState.selectedTeam)
    },
    {
      title: 'Best Member',
      value: getResolvedBestMemberName(votingState.selectedBestMember, 'Incomplete (2 required)'),
      step: 'best_member' as ScreenStep,
      filled: Array.isArray(votingState.selectedBestMember) && votingState.selectedBestMember.length === 2
    },
    {
      title: 'Best Event',
      value: getResolvedEventName(votingState.selectedBestEvent, 'Incomplete (2 required)'),
      step: 'best_event' as ScreenStep,
      filled: Array.isArray(votingState.selectedBestEvent) && votingState.selectedBestEvent.length === 2
    },
    {
      title: 'The Rookie',
      value: getResolvedRookieName(votingState.selectedRookie, 'Incomplete (2 required)'),
      step: 'rookie' as ScreenStep,
      filled: Array.isArray(votingState.selectedRookie) && votingState.selectedRookie.length === 2
    },
    {
      title: 'The Perfect Duo',
      value: getResolvedDuoName(votingState.selectedDuo, 'Incomplete (2 required)'),
      step: 'perfect_duo' as ScreenStep,
      filled: Array.isArray(votingState.selectedDuo) && votingState.selectedDuo.length === 2
    }
  ];

  const totalFilled = categories.filter(c => c.filled).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#142017]/95 border-l border-emerald-500/30 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl text-white">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-amber-200">
                Ballot Review 🗳️
              </h2>
              <p className="font-sans-clean text-xs text-emerald-300">
                Hugo Award 2026 - {votingState.userName || 'Guest'}
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="my-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/20">
            <div className="flex justify-between text-xs font-sans-clean font-semibold mb-2">
              <span className="text-amber-200">Ballot Completion</span>
              <span className="text-emerald-300">{Math.round((totalFilled / categories.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${(totalFilled / categories.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${cat.filled
                    ? 'bg-emerald-900/30 border-emerald-500/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  {cat.filled ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-[0.65rem] font-sans-clean uppercase tracking-wider text-amber-300/80 block">
                      {cat.title}
                    </span>
                    <span className="font-serif-display text-sm font-medium text-white block">
                      {cat.value}
                    </span>
                  </div>
                </div>

                {!votingState.isSubmitted && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onNavigate(cat.step);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-400/20 hover:text-amber-300 text-white/80 transition-colors"
                    title="Edit selection"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={() => {
              soundFx.playClick();
              if (votingState.isSubmitted || totalFilled === categories.length) {
                onNavigate('submission');
              } else {
                // Navigate to next unfulfilled step
                const firstEmpty = categories.find(c => !c.filled);
                if (firstEmpty) onNavigate(firstEmpty.step);
              }
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl font-serif-display font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all duration-200 text-center"
          >
            {votingState.isSubmitted
              ? 'View Receipt 🗳️'
              : totalFilled === categories.length
              ? 'Proceed to Final Submission 🚀'
              : 'Continue Voting'}
          </button>
        </div>
      </div>
    </div>
  );
};
