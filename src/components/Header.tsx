import React from 'react';
import { ScreenStep, VotingState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { getPendingApprovals } from '../utils/approvalStorage';
import {
  Volume2,
  VolumeX,
  Vote,
  BarChart2,
  Music,
  Menu,
  X,
  Home,
  FileText,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  currentStep: ScreenStep;
  votingState: VotingState;
  onNavigate: (step: ScreenStep) => void;
  onOpenBallotDrawer: () => void;
  onOpenAdminLeaderboard: () => void;
  onOpenGoogleLogin: () => void;
  onReset: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  votingState,
  onNavigate,
  onOpenBallotDrawer,
  onOpenAdminLeaderboard,
  onOpenGoogleLogin,
  onReset,
  onLogout
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());
  const [isBgMusicPlaying, setIsBgMusicPlaying] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Initial fetch
    setPendingCount(getPendingApprovals().length);

    const handleUpdate = () => {
      setPendingCount(getPendingApprovals().length);
    };

    window.addEventListener('hugo-toast', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    // Add custom event listener for approval/decline triggers in AdminModal
    window.addEventListener('approvals-updated', handleUpdate);

    return () => {
      window.removeEventListener('hugo-toast', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('approvals-updated', handleUpdate);
    };
  }, []);

  const confirmLogout = () => {
    soundFx.playSelect();
    if (onLogout) {
      onLogout();
    } else {
      onReset();
    }
    setShowLogoutConfirm(false);
    setIsMobileMenuOpen(false);
  };

  React.useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsBgMusicPlaying(true);
        }).catch(() => {
          // Autoplay blocked by browser policy until user gesture
        });
      }
    };

    startAudio();

    const handleUserGesture = () => {
      startAudio();
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };

    window.addEventListener('click', handleUserGesture);
    window.addEventListener('keydown', handleUserGesture);
    window.addEventListener('touchstart', handleUserGesture);

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };
  }, []);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const handleToggleBgMusic = () => {
    if (audioRef.current) {
      if (isBgMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Audio playback failed", err);
        });
      }
    }
  };

  // Count votes cast
  const votesCount = [
    Boolean(votingState.selectedTeam),
    Array.isArray(votingState.selectedBestMember) && votingState.selectedBestMember.length === 2,
    Array.isArray(votingState.selectedBestEvent) && votingState.selectedBestEvent.length === 2,
    Array.isArray(votingState.selectedRookie) && votingState.selectedRookie.length === 2,
    Array.isArray(votingState.selectedDuo) && votingState.selectedDuo.length === 2
  ].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 w-full lg:max-w-6xl lg:mx-auto lg:px-6 lg:py-2.5 transition-all duration-300" data-purpose="site-header">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/La Valse de L'Amour.mp3"
        loop
        autoPlay
        onPlay={() => setIsBgMusicPlaying(true)}
        onPause={() => setIsBgMusicPlaying(false)}
      />

      {/* Top Header Bar - Transparent background */}
      <div className="flex items-center justify-between w-full bg-transparent p-0 border-none shadow-none">

        {/* Brand Title & Hugo Logo */}
        <div
          onClick={() => {
            soundFx.playClick();
            onNavigate('landing');
          }}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group"
          data-purpose="brand-logo"
        >
          {/* Prominent Hugo Logo Icon with Glowing Golden Aura */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-amber-400 shrink-0">
            <img
              src="/assets/logo.webp"
              alt="Hugo English Club Logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/hugo_award_2024.png';
              }}
              className="w-full h-full object-cover scale-[1.4] bg-white"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif-display text-xs sm:text-sm lg:text-xl font-extrabold tracking-wider text-amber-200 lg:text-white text-shadow-elegant drop-shadow-md group-hover:text-amber-300 transition-colors leading-tight">
              HUGO ENGLISH CLUB
            </h1>
            <p className="font-serif-display italic text-[0.6rem] sm:text-xs text-amber-300/80 tracking-wide hidden sm:block">
              Light up your fire
            </p>
          </div>
        </div>

        {/* Mobile Hamburger Menu Toggle (< lg) */}
        <div className="lg:hidden flex items-center shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 hover:bg-amber-400/40 border-2 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.4)] active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-300" />
            ) : (
              <Menu className="w-5 h-5 text-amber-300" />
            )}
            <span className="font-sans-clean font-black text-xs uppercase tracking-wider text-amber-200">
              Menu
            </span>
            {votesCount > 0 && !isMobileMenuOpen && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>
        </div>

        {/* Desktop Top Right Actions Container (>= lg) */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white/90 hover:text-amber-300 transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>

          {/* BG Music Toggle */}
          <button
            onClick={handleToggleBgMusic}
            className={`relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${isBgMusicPlaying
              ? 'bg-fuchsia-900/40 border-fuchsia-400/60 text-fuchsia-200 hover:bg-fuchsia-800/50 shadow-[0_0_15px_rgba(232,121,249,0.5)]'
              : 'bg-black/40 hover:bg-black/60 border-white/20 text-white/90 hover:text-fuchsia-300'
              }`}
            title={isBgMusicPlaying ? "Pause ambient vibes 🌸" : "Play chill flower vibes 🌸"}
          >
            {isBgMusicPlaying && (
              <div className="absolute inset-0 rounded-full border border-fuchsia-400 animate-ping opacity-50 pointer-events-none" />
            )}
            <Music className={`w-4 h-4 ${isBgMusicPlaying ? 'text-fuchsia-300 animate-pulse' : 'text-fuchsia-200'}`} />
          </button>



          {/* Live Results Leaderboard Button */}
          {votingState.userEmail?.toLowerCase() === 'hugoclub.dut@gmail.com' && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAdminLeaderboard();
              }}
              className="relative px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-sans-clean font-medium flex items-center space-x-2 shadow-md backdrop-blur-md transition-all duration-200 shrink-0 cursor-pointer"
              title="View Live Leaderboard"
            >
              <BarChart2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Live Stats</span>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white animate-pulse shadow-sm">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* Google Auth / Profile Card */}
          {!votingState.userName ? (
            <div className="relative group shrink-0">
              <button
                id="header-login-button"
                onClick={() => {
                  soundFx.playClick();
                  onOpenGoogleLogin();
                }}
                className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-white hover:from-amber-400 hover:to-amber-100 text-gray-950 font-sans-clean font-black text-xs tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-1.5 cursor-pointer border border-amber-400 shrink-0"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span className="font-extrabold uppercase">Log in</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 shrink-0">
              {votingState.userAvatar && (
                <img
                  src={votingState.userAvatar}
                  alt={votingState.userName}
                  className="w-7 h-7 rounded-full border border-amber-400/80 object-cover shadow-sm shrink-0"
                />
              )}
              <span
                className="font-sans-clean text-xs font-bold text-amber-200 truncate max-w-[120px]"
                title={votingState.userEmail || votingState.userName}
              >
                {votingState.userName}
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(true);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-300 font-sans-clean text-xs transition-all border border-white/20 cursor-pointer"
                title="Log out"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop (< lg) */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer Panel (< lg) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 h-full w-[310px] sm:w-[360px] z-50 bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 border-l border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between p-5 sm:p-6 lg:hidden transform transition-transform duration-300 ease-out overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-amber-300 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.4)]">
              <img src="/assets/logo.webp" alt="Hugo" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h2 className="font-serif-display text-xs font-bold text-amber-300 tracking-wider">HUGO CHOICE 2026</h2>
              <p className="text-[0.65rem] text-gray-400 font-serif-display italic">Mobile Navigation</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen(false);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors border border-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account / Login Section */}
        <div className="my-5">
          {!votingState.userName ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/50 to-amber-900/30 border border-amber-500/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-sans-clean">
                  Tài khoản của bạn
                </span>
              </div>
              <p className="text-[0.75rem] text-gray-300 mb-3 leading-relaxed">
                Đăng nhập bằng Google để lưu chính xác các lựa chọn bình chọn của bạn.
              </p>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenGoogleLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 hover:from-amber-300 hover:to-white text-gray-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center space-x-2 active:scale-98 transition-all border border-amber-300 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-400/40 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                {votingState.userAvatar ? (
                  <img
                    src={votingState.userAvatar}
                    alt={votingState.userName}
                    className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-300">
                    {votingState.userName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-amber-200 truncate">{votingState.userName}</h3>
                  <p className="text-[0.7rem] text-gray-400 truncate">{votingState.userEmail || 'Thành viên Hugo'}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(true);
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 space-y-4 my-2">
          <div className="text-[0.65rem] font-bold text-amber-400/80 uppercase tracking-widest px-1">
            Danh mục & Đề mục
          </div>

          <div className="space-y-1.5">
            {/* Landing Navigation */}
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('landing');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all border cursor-pointer ${currentStep === 'landing'
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/10'
                }`}
            >
              <div className="flex items-center space-x-2.5">
                <Home className="w-4 h-4 text-amber-400" />
                <span>Trang chủ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>

            {/* Voting Rules / Process */}
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('process');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all border cursor-pointer ${currentStep === 'process'
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/10'
                }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Thể lệ bình chọn</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>



            {/* Live Stats Leaderboard */}
            {votingState.userEmail?.toLowerCase() === 'hugoclub.dut@gmail.com' && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAdminLeaderboard();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-200 flex items-center justify-between text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <BarChart2 className="w-4 h-4 text-amber-300" />
                  <span>Bảng xếp hạng Trực tiếp</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400/60" />
              </button>
            )}
          </div>

          {/* Sound Controls Header & Buttons */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-[0.65rem] font-bold text-amber-400/80 uppercase tracking-widest px-1">
              Cài đặt Âm thanh
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleSound}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${isMuted
                  ? 'bg-red-950/30 border-red-500/30 text-red-300'
                  : 'bg-amber-500/10 border-amber-400/30 text-amber-200'
                  }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                <span className="text-[0.7rem] font-medium">{isMuted ? 'Tắt FX' : 'Bật FX'}</span>
              </button>

              <button
                onClick={handleToggleBgMusic}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${isBgMusicPlaying
                  ? 'bg-fuchsia-950/40 border-fuchsia-400/50 text-fuchsia-200 shadow-[0_0_12px_rgba(232,121,249,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
              >
                <Music className={`w-4 h-4 ${isBgMusicPlaying ? 'text-fuchsia-300 animate-pulse' : ''}`} />
                <span className="text-[0.7rem] font-medium">{isBgMusicPlaying ? 'Nhạc nền: Bật' : 'Nhạc nền: Tắt'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-amber-500/20 text-center">
          <p className="font-serif-display italic text-xs text-amber-200/90 mb-1">
            "Light up your fire ✨"
          </p>
          <p className="text-[0.65rem] text-gray-500 font-sans-clean">
            Hugo English Club Choice Awards 2026
          </p>
        </div>
      </aside>

      {/* Glassmorphic Custom Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm border border-white/40 bg-white/20 hover:bg-white/25 backdrop-blur-2xl rounded-2xl p-6 text-center text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center text-rose-600 mb-4 shadow-sm animate-pulse">
              <LogOut className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="font-serif-display text-lg font-black text-slate-900 tracking-tight mb-2">
              Log Out
            </h3>

            <p className="font-sans-clean text-xs sm:text-sm text-slate-800 font-semibold mb-6 leading-relaxed">
              Are you sure you want to log out of your account? Any unsaved progress will be reset.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(false);
                }}
                className="px-5 py-2 rounded-full border border-slate-300 text-slate-700 bg-white/50 hover:bg-white/70 font-sans-clean font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-sans-clean font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-[0_4px_12px_rgba(225,29,72,0.3)] active:scale-95"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
