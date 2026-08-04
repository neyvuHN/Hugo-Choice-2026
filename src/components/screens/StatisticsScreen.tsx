import React, { useState, useEffect } from 'react';
import { ScreenStep, LiveResultsData, HugoTeam, VotingState } from '../../types';
import { TEAMS, BEST_EVENTS } from '../../data/mockData';
import { getAllMembers, getAllRookies, addCustomMember } from '../../data/membersData';
import { getResolvedBestMemberName, getResolvedRookieName, getResolvedDuoName, getResolvedEventName } from '../../utils/ballotHelpers';
import { soundFx } from '../../utils/soundEffects';
import { 
  getPendingApprovals, 
  savePendingApprovals, 
  addCustomEventToDatabase, 
  PendingApproval 
} from '../../utils/approvalStorage';
import { 
  ArrowLeft, 
  Award, 
  Search, 
  Sparkles, 
  Calendar, 
  Flame, 
  Users, 
  Check, 
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  TrendingUp,
  Heart,
  XCircle
} from 'lucide-react';

interface StatisticsScreenProps {
  results: LiveResultsData;
  onBack: () => void;
  votingState: VotingState;
}

const TEAM_INFO_MAP: Record<HugoTeam, { name: string; color: string; bg: string; icon: string }> = {
  prs: { name: 'Power Rangers', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', icon: '⚡' },
  hc: { name: 'Heroes Company', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', icon: '🛡️' },
  bnn: { name: 'Banana', color: '#eab308', bg: 'rgba(234, 179, 8, 0.2)', icon: '🍌' },
  niff: { name: 'Nifflers', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', icon: '🐾' }
};

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ results, onBack, votingState }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'rookies' | 'duos' | 'approvals'>('members');
  const [showZeroVotes, setShowZeroVotes] = useState<boolean>(true); // DEFAULT TO SHOW ALL NOMINEES
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [pendingList, setPendingList] = useState<PendingApproval[]>([]);

  const totalSubmissions = results.totalSubmissions || 0;
  const isAdmin = votingState.userEmail?.toLowerCase() === 'hugoclub.dut@gmail.com';

  // Load approvals list
  useEffect(() => {
    setPendingList(getPendingApprovals());
    
    const handleUpdate = () => {
      setPendingList(getPendingApprovals());
    };
    window.addEventListener('approvals-updated', handleUpdate);
    return () => {
      window.removeEventListener('approvals-updated', handleUpdate);
    };
  }, []);

  const handleApprove = (item: PendingApproval) => {
    soundFx.playSelect();
    if (item.type === 'member') {
      addCustomMember(item.name, item.teamId || 'prs');
    } else {
      addCustomEventToDatabase(item.name);
    }
    const updated = pendingList.filter(p => p.id !== item.id);
    setPendingList(updated);
    savePendingApprovals(updated);
    window.dispatchEvent(new CustomEvent('approvals-updated'));
  };

  const handleDecline = (item: PendingApproval) => {
    soundFx.playClick();
    const updated = pendingList.filter(p => p.id !== item.id);
    setPendingList(updated);
    savePendingApprovals(updated);
    window.dispatchEvent(new CustomEvent('approvals-updated'));
  };

  // 1. Process Best Members
  const allMembers = getAllMembers();
  const membersWithVotes = allMembers.map(m => {
    const votes = results.bestMember[m.id] || results.bestMember[m.name] || 0;
    return {
      id: m.id,
      name: m.name,
      teamId: m.teamId,
      teamName: m.teamName,
      votes
    };
  });

  // 2. Process Best Events
  const eventsWithVotes = BEST_EVENTS.map(e => {
    const votes = results.bestEvent[e.id] || results.bestEvent[e.name] || 0;
    return {
      id: e.id,
      name: e.name,
      icon: e.icon,
      tag: e.tag,
      votes
    };
  });

  // 3. Process Rookies
  const allRookies = getAllRookies();
  const rookiesWithVotes = allRookies.map(r => {
    const votes = results.rookie[r.id] || results.rookie[r.name] || 0;
    return {
      id: r.id,
      name: r.name,
      teamId: r.teamId,
      teamName: r.teamName,
      votes
    };
  });

  // 4. Process Duos
  const duosWithVotes = Object.entries(results.perfectDuo).map(([duoString, count]) => {
    const resolvedName = getResolvedDuoName(duoString);
    return {
      id: duoString,
      name: resolvedName,
      votes: count
    };
  });

  // Helpers for sorting and filtering
  const processList = (list: Array<{ name: string; votes: number; [key: string]: any }>) => {
    let filtered = list;
    
    // Filter out 0-vote items if showZeroVotes is false
    if (!showZeroVotes) {
      filtered = filtered.filter(item => item.votes > 0);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const normalizedQuery = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(item => {
        const normalizedName = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalizedName.includes(normalizedQuery);
      });
    }

    // Sort by votes
    return filtered.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.votes - a.votes || a.name.localeCompare(b.name, 'vi');
      } else {
        return a.votes - b.votes || a.name.localeCompare(b.name, 'vi');
      }
    });
  };

  const filteredMembers = processList(membersWithVotes);
  const filteredEvents = processList(eventsWithVotes);
  const filteredRookies = processList(rookiesWithVotes);
  const filteredDuos = processList(duosWithVotes);

  const getRankBadgeClass = (index: number) => {
    if (sortOrder === 'asc') return 'bg-slate-700/55 text-slate-300';
    switch (index) {
      case 0: return 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.6)] border border-amber-300';
      case 1: return 'bg-gradient-to-r from-slate-300 to-slate-100 text-slate-950 font-black shadow-[0_0_10px_rgba(255,255,255,0.4)] border border-slate-200';
      case 2: return 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white font-bold shadow-[0_0_10px_rgba(180,83,9,0.3)] border border-amber-600';
      default: return 'bg-slate-800/80 text-slate-300 border border-white/5';
    }
  };

  const getRankLabel = (index: number) => {
    if (sortOrder === 'asc') return `#${index + 1}`;
    switch (index) {
      case 0: return '🥇 1st';
      case 1: return '🥈 2nd';
      case 2: return '🥉 3rd';
      default: return `#${index + 1}`;
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    soundFx.playClick();
    setActiveTab(tab);
    setSearchQuery('');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between w-full min-h-[90vh] px-4 py-6 max-w-5xl mx-auto z-10 text-white select-none">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-400/30 pb-5 mb-6 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onBack();
            }}
            className="p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-amber-200 hover:text-white border border-amber-400/40 hover:border-amber-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center shrink-0"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <div>
            <h2 className="font-serif-display text-2xl sm:text-4xl font-extrabold text-amber-200 tracking-wide text-shadow-elegant">
              Hugo Award 2026 Live Stats 📊
            </h2>
            <p className="font-serif-display italic text-xs sm:text-sm text-amber-100/70 mt-0.5 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Báo cáo số liệu bình chọn trực tuyến thời gian thực
            </p>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="p-3 rounded-2xl bg-black/75 border border-amber-300/40 backdrop-blur-2xl shadow-xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/30">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-amber-300/80 font-black tracking-widest block">Tổng Phiếu Bầu</span>
            <span className="text-xl font-bold font-sans-clean text-white">{totalSubmissions} phiếu đã nộp</span>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1 w-full z-20">
        
        {/* Left Side: Teams Distribution */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-black/85 border border-amber-300/40 backdrop-blur-3xl shadow-2xl">
            <h3 className="font-serif-display text-sm font-extrabold uppercase tracking-widest text-amber-300 mb-4 flex items-center justify-between border-b border-white/10 pb-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-300" /> Teams Distribution
              </span>
            </h3>

            <div className="flex flex-col gap-3.5">
              {TEAMS.map(team => {
                const count = results.teams[team.id] || 0;
                const percent = totalSubmissions ? Math.round((count / totalSubmissions) * 100) : 0;
                const badge = TEAM_INFO_MAP[team.id];

                return (
                  <div key={team.id} className="p-3 rounded-2xl bg-white/5 border border-white/15 relative overflow-hidden transition-all hover:bg-white/8">
                    <div 
                      className="absolute inset-0 z-0 pointer-events-none opacity-5 transition-opacity" 
                      style={{ backgroundColor: team.color }}
                    />
                    
                    <div className="relative z-10 flex justify-between items-center mb-1">
                      <span className="font-serif-display text-xs font-black text-white flex items-center gap-1.5">
                        <span className="text-sm shrink-0">{badge.icon}</span>
                        <span>{team.name}</span>
                      </span>
                      <span className="text-xs font-bold text-amber-200">
                        {count} votes ({percent}%)
                      </span>
                    </div>

                    <div className="relative z-10 w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${percent}%`, backgroundColor: team.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Category Leaderboards */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 sm:p-6 rounded-3xl bg-black/85 border border-amber-300/40 backdrop-blur-3xl shadow-2xl flex flex-col min-h-[500px]">
            
            {/* Category Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3.5 mb-4 shrink-0 font-serif-display">
              <button
                onClick={() => handleTabChange('members')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Best Member</span>
              </button>
              
              <button
                onClick={() => handleTabChange('events')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Best Event</span>
              </button>

              <button
                onClick={() => handleTabChange('rookies')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'rookies'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Flame className="w-4 h-4 shrink-0" />
                <span>Rookie Award</span>
              </button>

              <button
                onClick={() => handleTabChange('duos')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'duos'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className="w-4 h-4 shrink-0" />
                <span>Perfect Duo</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleTabChange('approvals')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'approvals'
                      ? 'bg-rose-500 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-[1.02]'
                      : 'bg-white/5 border border-rose-500/30 text-rose-200 hover:text-white hover:bg-rose-500/10'
                  }`}
                >
                  <span>Pending Requests</span>
                  {pendingList.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                      {pendingList.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Filter Control Header */}
            {activeTab !== 'approvals' && (
              <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between mb-4 shrink-0">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm ứng viên..."
                    className="w-full py-2 pl-9 pr-3 rounded-xl bg-gray-950/80 text-white placeholder-slate-400 font-sans-clean text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 border border-amber-300/40"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-300 pointer-events-none" />
                </div>

                {/* Sorting and Zero-Votes Switches */}
                <div className="flex items-center gap-4 text-xs font-sans-clean font-extrabold select-none text-amber-200/90 flex-wrap">
                  
                  {/* Sort Order Toggle */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-white/8 transition-colors cursor-pointer"
                  >
                    {sortOrder === 'desc' ? (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Cao đến Thấp</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>Thấp đến Cao</span>
                      </>
                    )}
                  </button>

                  {/* Show Empty Candidates Toggle */}
                  {activeTab !== 'duos' && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowZeroVotes(!showZeroVotes);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-white/8 transition-colors cursor-pointer"
                    >
                      {showZeroVotes ? (
                        <ToggleRight className="w-5 h-5 text-amber-300" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-white/30" />
                      )}
                      <span>Hiện ứng viên 0 vote</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Leaderboard Lists */}
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-1.5 space-y-2.5 custom-scrollbar">
              
              {/* MEMBER LIST */}
              {activeTab === 'members' && (
                filteredMembers.length > 0 ? (
                  filteredMembers.map((item, idx) => {
                    const percent = totalSubmissions ? Math.round((item.votes / totalSubmissions) * 100) : 0;
                    const badge = TEAM_INFO_MAP[item.teamId as HugoTeam] || { name: item.teamName || 'Custom', color: '#94a3b8', bg: 'bg-slate-500/20', icon: '👤' };
                    
                    return (
                      <div 
                        key={item.id} 
                        className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-amber-300/40 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge */}
                            <span className={`w-12 h-6 text-[10px] rounded-full flex items-center justify-center shrink-0 ${getRankBadgeClass(idx)}`}>
                              {getRankLabel(idx)}
                            </span>
                            
                            <span className="font-serif-display text-sm sm:text-base font-bold text-white truncate">
                              {item.name}
                            </span>

                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black flex items-center gap-1 shrink-0 ${badge.bg} border border-white/5`}>
                              <span className="text-[11px]">{badge.icon}</span>
                              <span style={{ color: badge.color }}>{badge.name}</span>
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-amber-300 font-sans-clean font-black text-sm sm:text-base block">
                              {item.votes} votes
                            </span>
                            <span className="text-[10px] text-white/50 block font-bold">
                              {percent}% người bầu
                            </span>
                          </div>
                        </div>

                        {/* Animated Percentage Progress Bar */}
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r"
                            style={{ 
                              width: `${percent}%`, 
                              backgroundImage: `linear-gradient(to right, ${badge.color}, #fef08a)` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-white/40 italic font-semibold text-sm">
                    Không có ứng viên nào khớp với tìm kiếm
                  </div>
                )
              )}

              {/* EVENTS LIST */}
              {activeTab === 'events' && (
                filteredEvents.length > 0 ? (
                  filteredEvents.map((item, idx) => {
                    const percent = totalSubmissions ? Math.round((item.votes / totalSubmissions) * 100) : 0;
                    
                    return (
                      <div 
                        key={item.id} 
                        className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-amber-300/40 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge */}
                            <span className={`w-12 h-6 text-[10px] rounded-full flex items-center justify-center shrink-0 ${getRankBadgeClass(idx)}`}>
                              {getRankLabel(idx)}
                            </span>
                            
                            <span className="text-base shrink-0 select-none">{item.icon}</span>
                            
                            <span className="font-serif-display text-sm sm:text-base font-bold text-white truncate">
                              {item.name}
                            </span>

                            <span className="text-[8px] tracking-wider px-2 py-0.5 rounded-full font-black shrink-0 bg-white/5 border border-white/10 text-amber-200">
                              {item.tag}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-amber-300 font-sans-clean font-black text-sm sm:text-base block">
                              {item.votes} votes
                            </span>
                            <span className="text-[10px] text-white/50 block font-bold">
                              {percent}% người bầu
                            </span>
                          </div>
                        </div>

                        {/* Animated Percentage Progress Bar */}
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 to-amber-200"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-white/40 italic font-semibold text-sm">
                    Không có sự kiện nào khớp với tìm kiếm
                  </div>
                )
              )}

              {/* ROOKIES LIST */}
              {activeTab === 'rookies' && (
                filteredRookies.length > 0 ? (
                  filteredRookies.map((item, idx) => {
                    const percent = totalSubmissions ? Math.round((item.votes / totalSubmissions) * 100) : 0;
                    const badge = TEAM_INFO_MAP[item.teamId as HugoTeam] || { name: item.teamName || 'Custom', color: '#94a3b8', bg: 'bg-slate-500/20', icon: '🌱' };
                    
                    return (
                      <div 
                        key={item.id} 
                        className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-amber-300/40 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge */}
                            <span className={`w-12 h-6 text-[10px] rounded-full flex items-center justify-center shrink-0 ${getRankBadgeClass(idx)}`}>
                              {getRankLabel(idx)}
                            </span>
                            
                            <span className="font-serif-display text-sm sm:text-base font-bold text-white truncate">
                              {item.name}
                            </span>

                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black flex items-center gap-1 shrink-0 ${badge.bg} border border-white/5`}>
                              <span className="text-[11px]">{badge.icon}</span>
                              <span style={{ color: badge.color }}>{badge.name}</span>
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-amber-300 font-sans-clean font-black text-sm sm:text-base block">
                              {item.votes} votes
                            </span>
                            <span className="text-[10px] text-white/50 block font-bold">
                              {percent}% người bầu
                            </span>
                          </div>
                        </div>

                        {/* Animated Percentage Progress Bar */}
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r"
                            style={{ 
                              width: `${percent}%`, 
                              backgroundImage: `linear-gradient(to right, ${badge.color}, #fef08a)` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-white/40 italic font-semibold text-sm">
                    Không có Rookie nào khớp với tìm kiếm
                  </div>
                )
              )}

              {/* DUO LIST */}
              {activeTab === 'duos' && (
                filteredDuos.length > 0 ? (
                  filteredDuos.map((item, idx) => {
                    const percent = totalSubmissions ? Math.round((item.votes / totalSubmissions) * 100) : 0;
                    
                    return (
                      <div 
                        key={item.id} 
                        className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-2.5 hover:border-amber-300/40 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge */}
                            <span className={`w-12 h-6 text-[10px] rounded-full flex items-center justify-center shrink-0 ${getRankBadgeClass(idx)}`}>
                              {getRankLabel(idx)}
                            </span>
                            
                            <span className="font-serif-display text-sm sm:text-base font-bold text-white truncate">
                              {item.name}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-amber-300 font-sans-clean font-black text-sm sm:text-base block">
                              {item.votes} votes
                            </span>
                            <span className="text-[10px] text-white/50 block font-bold">
                              {percent}% người bầu
                            </span>
                          </div>
                        </div>

                        {/* Animated Percentage Progress Bar */}
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-purple-500 to-amber-200"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-white/40 italic font-semibold text-sm">
                    Chưa có Duo nào nhận được lượt vote
                  </div>
                )
              )}

              {/* APPROVALS LIST */}
              {activeTab === 'approvals' && isAdmin && (
                pendingList.length > 0 ? (
                  <div className="space-y-3">
                    {pendingList.map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 text-left">
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
                            className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95 animate-duration-150"
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
                )
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer copyright */}
      <div className="w-full text-center py-4 mt-6 border-t border-white/5 z-20">
        <p className="text-xs text-white/45 italic font-serif-display">
          Thank you for participating at Hugo Award 2026! • Hugo English Club
        </p>
      </div>

    </div>
  );
};
