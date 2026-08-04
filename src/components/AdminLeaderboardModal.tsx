import React, { useState, useEffect } from 'react';
import { LiveResultsData, HugoTeam } from '../types';
import { BEST_EVENTS, TEAMS } from '../data/mockData';
import { getResolvedBestMemberName, getResolvedRookieName, getResolvedDuoName } from '../utils/ballotHelpers';
import { X, Award, Flame, Users, Calendar, Sparkles, Check, XCircle } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import {
  getPendingApprovals,
  savePendingApprovals,
  addCustomEventToDatabase,
  PendingApproval
} from '../utils/approvalStorage';
import { addCustomMember } from '../data/membersData';

interface AdminLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: LiveResultsData;
  onClearMyBallot?: () => void;
}

export const AdminLeaderboardModal: React.FC<AdminLeaderboardModalProps> = ({
  isOpen,
  onClose,
  results,
  onClearMyBallot
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'approvals'>('stats');
  const [pendingList, setPendingList] = useState<PendingApproval[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPendingList(getPendingApprovals());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = (item: PendingApproval) => {
    soundFx.playSelect();
    if (item.type === 'member') {
      // Add custom member to data store (which saves in localStorage)
      addCustomMember(item.name, item.teamId || 'prs');
    } else {
      // Add custom event to approvalStorage custom list
      addCustomEventToDatabase(item.name);
    }

    // Remove from pending list
    const updated = pendingList.filter(p => p.id !== item.id);
    setPendingList(updated);
    savePendingApprovals(updated);
    window.dispatchEvent(new CustomEvent('approvals-updated'));
  };

  const handleDecline = (item: PendingApproval) => {
    soundFx.playClick();
    // Remove from pending list
    const updated = pendingList.filter(p => p.id !== item.id);
    setPendingList(updated);
    savePendingApprovals(updated);
    window.dispatchEvent(new CustomEvent('approvals-updated'));
  };

  const pendingCount = pendingList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#121c14] border border-amber-400/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-[#18281b] to-amber-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-amber-400/20 border border-amber-400/50">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl md:text-2xl font-bold text-amber-200">
                Live Hugo Award 2026 Leaderboard
              </h2>
              <p className="font-sans-clean text-xs text-emerald-300 flex items-center space-x-2">
                <span>Total Votes Cast: <strong className="text-amber-300">{results.totalSubmissions}</strong></span>
                <span>•</span>
                <span className="flex items-center text-amber-300">
                  <Flame className="w-3.5 h-3.5 mr-1" /> Live Tally
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 py-2 gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('stats');
            }}
            className={`pb-2 pt-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Live Statistics
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('approvals');
            }}
            className={`pb-2 pt-1 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span>Pending Requests</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'stats' ? (
            <div className="space-y-8">
              {/* Teams Stats */}
              <div>
                <h3 className="font-serif-display text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" /> Teams Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TEAMS.map(team => {
                    const count = results.teams[team.id] || 0;
                    const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                    return (
                      <div key={team.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <span className="text-2xl block mb-1">{team.icon}</span>
                        <span className="font-serif-display text-sm font-semibold block text-white">{team.name}</span>
                        <span className="text-amber-300 font-sans-clean font-bold text-lg block my-1">{count} votes</span>
                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: team.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Best Member */}
              <div>
                <h3 className="font-serif-display text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" /> Best Member
                </h3>
                <div className="space-y-2">
                  {Object.entries(results.bestMember).filter(([_, count]) => count > 0).length > 0 ? (
                    Object.entries(results.bestMember)
                      .filter(([_, count]) => count > 0)
                      .map(([idOrName, count]) => {
                        const name = getResolvedBestMemberName(idOrName);
                        const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                        return (
                          <div key={idOrName} className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
                            <div className="flex-1 pr-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-serif-display font-medium text-white">{name}</span>
                                <span className="text-amber-300 font-bold">{count} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-white/50 italic px-1 py-2">Chưa có lượt bình chọn nào</p>
                  )}
                </div>
              </div>

              {/* Best Event */}
              <div>
                <h3 className="font-serif-display text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Best Event
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BEST_EVENTS.filter(e => (results.bestEvent[e.id] || 0) > 0).length > 0 ? (
                    BEST_EVENTS.filter(e => (results.bestEvent[e.id] || 0) > 0).map(e => {
                      const count = results.bestEvent[e.id] || 0;
                      const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                      return (
                        <div key={e.id} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-3xl">{e.icon}</span>
                            <div>
                              <h4 className="font-serif-display font-bold text-white text-base">{e.name}</h4>
                              <span className="text-xs text-amber-300 font-bold">{count} votes ({percent}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-white/50 italic px-1 py-2 col-span-full">Chưa có lượt bình chọn nào</p>
                  )}
                </div>
              </div>

              {/* The Rookie */}
              <div>
                <h3 className="font-serif-display text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
                  🌱 The Rookie Award
                </h3>
                <div className="space-y-2">
                  {Object.entries(results.rookie).filter(([_, count]) => count > 0).length > 0 ? (
                    Object.entries(results.rookie)
                      .filter(([_, count]) => count > 0)
                      .map(([idOrName, count]) => {
                        const name = getResolvedRookieName(idOrName);
                        const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                        return (
                          <div key={idOrName} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex-1 pr-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-serif-display font-medium text-white">{name}</span>
                                <span className="text-emerald-300 font-bold">{count} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400 rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-white/50 italic px-1 py-2">Chưa có lượt bình chọn nào</p>
                  )}
                </div>
              </div>

              {/* Perfect Duo */}
              <div>
                <h3 className="font-serif-display text-sm uppercase tracking-widest text-amber-300 mb-3 flex items-center">
                  🦋 The Perfect Duo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(results.perfectDuo).filter(([_, count]) => count > 0).length > 0 ? (
                    Object.entries(results.perfectDuo)
                      .filter(([_, count]) => count > 0)
                      .map(([idOrName, count]) => {
                        const name = getResolvedDuoName(idOrName);
                        const percent = results.totalSubmissions ? Math.round((count / results.totalSubmissions) * 100) : 0;

                        return (
                          <div key={idOrName} className="p-3 rounded-lg bg-purple-950/20 border border-purple-400/30 flex justify-between items-center">
                            <div>
                              <span className="font-serif-display text-sm font-semibold text-white block">
                                {name}
                              </span>
                              <span className="text-xs text-purple-200">{count} votes ({percent}%)</span>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-white/50 italic px-1 py-2 col-span-full">Chưa có lượt bình chọn nào</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Approvals Section */
            <div className="space-y-4">
              <h3 className="font-serif-display text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
                <span>Manage User Creation Requests</span>
                <span className="text-xs font-normal text-white/50">
                  (Accept to append into the database, Decline to drop)
                </span>
              </h3>

              {pendingList.length > 0 ? (
                <div className="space-y-3">
                  {pendingList.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.type === 'member'
                                ? 'bg-blue-500/20 border border-blue-400 text-blue-200'
                                : 'bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-200'
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.teamId && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-white/10 text-white font-extrabold uppercase">
                              {item.teamId}
                            </span>
                          )}
                          <strong className="text-white text-sm sm:text-base font-serif-display truncate block max-w-[300px]">
                            {item.name}
                          </strong>
                        </div>
                        <p className="text-xs text-white/40 italic">
                          Requested by {item.requestedBy || 'Guest'} on {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(item)}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleDecline(item)}
                          className="px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-white/10 bg-white/2">
                  <span className="text-4xl block mb-2">🎉</span>
                  <p className="text-sm text-white/50 italic">No pending approval requests at this moment.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          {import.meta.env.VITE_ALLOW_REVOTE === 'true' ? (
            <button
              onClick={() => {
                soundFx.playClick();
                if (window.confirm("Are you sure you want to clear your ballot and vote again? Your previous votes will be removed from the live tally.")) {
                  if (onClearMyBallot) onClearMyBallot();
                }
              }}
              className="px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 hover:bg-red-500/30 text-red-400 font-serif-display font-bold text-xs transition-colors cursor-pointer"
            >
              Clear My Ballot & Revote
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-full bg-amber-400 text-black font-serif-display font-bold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
