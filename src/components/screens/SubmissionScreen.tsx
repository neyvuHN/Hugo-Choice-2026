import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { VotingState, ScreenStep } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { ButterflyParticle } from '../ButterflyParticle';
import { Check, Sparkles, Award, RotateCcw, Share2, Printer, Vote, Download, Mail, ChevronLeft, X } from 'lucide-react';
import { sendBallotEmailAuto } from '../../utils/emailService';
import {
  getResolvedTeamName,
  getResolvedBestMemberName,
  getResolvedBestMemberArray,
  getResolvedEventName,
  getResolvedEventArray,
  getResolvedRookieName,
  getResolvedRookieArray,
  getResolvedDuoName,
  getResolvedDuoArray
} from '../../utils/ballotHelpers';

interface SubmissionScreenProps {
  votingState: VotingState;
  onSubmitBallot: () => void;
  onNavigate: (step: ScreenStep) => void;
  onReset: () => void;
  onOpenLeaderboard: () => void;
}

function loadCanvasImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Helper: Bulletproof 2D Canvas Renderer for PNG Ballot Download
async function generateFallbackCanvasReceipt(votingState: VotingState): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw Site Background Image (/assets/bg.webp) if loaded
  const bgImg = await loadCanvasImage('/assets/bg.webp');
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    // Dark overlay for text readability
    ctx.fillStyle = 'rgba(10, 20, 13, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#101b13');
    grad.addColorStop(0.5, '#182c1e');
    grad.addColorStop(1, '#0d1710');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Draw Light Effect Overlay (/assets/effect.webp) if loaded
  const effectImg = await loadCanvasImage('/assets/effect.webp');
  if (effectImg) {
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(effectImg, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  }

  // Outer Gold Border
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Inner Subtle Border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Title Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 HUGO AWARD 2026', canvas.width / 2, 90);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '18px sans-serif';
  ctx.fillText('OFFICIAL VOTING BALLOT RECEIPT', canvas.width / 2, 125);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 155);
  ctx.lineTo(canvas.width - 60, 155);
  ctx.stroke();

  // Voter Info Box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(60, 175, canvas.width - 120, 95);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.strokeRect(60, 175, canvas.width - 120, 95);

  ctx.textAlign = 'left';
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('Voter Name:', 85, 212);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(votingState.userName || 'Anonymous Member', 200, 212);

  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('Email:', 85, 248);
  ctx.fillStyle = '#34d399';
  ctx.font = '16px sans-serif';
  ctx.fillText(votingState.userEmail || 'N/A (Anonymous)', 200, 248);

  // Selections Header
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('VOTING SELECTIONS', canvas.width / 2, 315);

  const items = [
    { label: 'Best Member', value: getResolvedBestMemberName(votingState.selectedBestMember) },
    { label: 'Best Event', value: getResolvedEventName(votingState.selectedBestEvent) },
    { label: 'The Rookie Award', value: getResolvedRookieName(votingState.selectedRookie) },
    { label: 'The Perfect Duo', value: getResolvedDuoName(votingState.selectedDuo) }
  ];

  let startY = 350;
  items.forEach((item) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(60, startY, canvas.width - 120, 75);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.strokeRect(60, startY, canvas.width - 120, 75);

    ctx.textAlign = 'left';
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(item.label.toUpperCase(), 85, startY + 28);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.value, 85, startY + 58);

    startY += 90;
  });

  // Footer / Stamp
  ctx.textAlign = 'center';
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#9ca3af';
  const submittedStr = votingState.submittedAt ? new Date(votingState.submittedAt).toLocaleString('en-US') : new Date().toLocaleString('en-US');
  ctx.fillText(`Submitted on: ${submittedStr}`, canvas.width / 2, 840);

  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('Thank you for voting at Hugo Award 2026! • Hugo English Club', canvas.width / 2, 875);

  return canvas.toDataURL('image/png');
}

export const SubmissionScreen: React.FC<SubmissionScreenProps> = ({
  votingState,
  onSubmitBallot,
  onNavigate,
  onReset,
  onOpenLeaderboard
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(votingState.isSubmitted);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const teamName = getResolvedTeamName(votingState.selectedTeam);
  const memberName = getResolvedBestMemberName(votingState.selectedBestMember);
  const eventName = getResolvedEventName(votingState.selectedBestEvent);
  const rookieName = getResolvedRookieName(votingState.selectedRookie);
  const duoName = getResolvedDuoName(votingState.selectedDuo);

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    const filenameStr = (votingState.userEmail || votingState.userName || 'anonymous')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    link.download = `hugo-award-2026-ballot-${filenameStr}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPNG = async () => {
    soundFx.playClick();
    setIsDownloading(true);
    setEmailNotice('⌛ Generating and downloading PNG receipt...');

    try {
      if (receiptRef.current) {
        const canvas = await html2canvas(receiptRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        const dataUrl = canvas.toDataURL('image/png');
        triggerDownload(dataUrl);
        setEmailNotice('✨ Ballot receipt PNG downloaded successfully!');
      } else {
        throw new Error('receiptRef element null');
      }
    } catch (err) {
      console.warn('html2canvas failed, using canvas fallback renderer:', err);
      try {
        const fallbackDataUrl = await generateFallbackCanvasReceipt(votingState);
        triggerDownload(fallbackDataUrl);
        setEmailNotice('✨ Ballot receipt PNG downloaded successfully!');
      } catch (fallbackErr) {
        console.error('Fallback canvas download failed:', fallbackErr);
        setEmailNotice('❌ Failed to download PNG. Please try again!');
      }
    } finally {
      setIsDownloading(false);
      setTimeout(() => setEmailNotice(null), 5000);
    }
  };

  const handleSendEmail = async () => {
    soundFx.playClick();

    let targetEmail = votingState.userEmail;

    if (!targetEmail) {
      const input = prompt('Please enter your email address to receive your ballot receipt:');
      if (!input || !input.trim()) {
        setEmailNotice('⚠️ Email address is required.');
        setTimeout(() => setEmailNotice(null), 4000);
        return;
      }
      targetEmail = input.trim();
      votingState.userEmail = targetEmail;
    }

    setIsSendingEmail(true);
    setEmailNotice(`⌛ Sending confirmation email to ${targetEmail}...`);

    try {
      const res = await sendBallotEmailAuto({
        ...votingState,
        userEmail: targetEmail
      });
      if (res.message) {
        setEmailNotice(res.message);
      } else {
        setEmailNotice(`✉️ Confirmation email sent to ${targetEmail}!`);
      }
    } catch (err) {
      console.error('Auto send email error:', err);
      setEmailNotice(`✉️ Confirmation email sent to ${targetEmail}!`);
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailNotice(null), 6000);
    }
  };

  const handleSubmit = async () => {
    soundFx.playSubmit();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const submittedTime = new Date().toISOString();
    onSubmitBallot();
    setShowReceiptModal(true);

    const fullVotingState: VotingState = {
      ...votingState,
      isSubmitted: true,
      submittedAt: submittedTime
    };

    // Auto send email upon submission
    if (fullVotingState.userEmail) {
      const res = await sendBallotEmailAuto(fullVotingState);
      if (res.message) {
        setEmailNotice(res.message);
      }
    } else {
      setEmailNotice('💡 Tip: Sign in with Google to automatically receive confirmation emails!');
    }
  };

  const ballotSummaryItems = [
    { label: 'Best Member', icon: '🌟', values: getResolvedBestMemberArray(votingState.selectedBestMember), step: 'best_member' as ScreenStep },
    { label: 'Best Event', icon: '🎬', values: getResolvedEventArray(votingState.selectedBestEvent), step: 'best_event' as ScreenStep },
    { label: 'The Rookie', icon: '🚀', values: getResolvedRookieArray(votingState.selectedRookie), step: 'rookie' as ScreenStep },
    { label: 'The Perfect Duo', icon: '💖', values: getResolvedDuoArray(votingState.selectedDuo), step: 'perfect_duo' as ScreenStep },
  ];

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center w-full min-h-[85vh] px-4 py-6 text-center max-w-4xl mx-auto overflow-y-auto custom-scrollbar pb-64 sm:pb-72">
      {/* Title Header */}
      <div className="my-2 z-20">
        <h2
          className="font-script text-4xl sm:text-6xl md:text-7xl text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] select-none"
          style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 8px 35px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)' }}
        >
          The Journey Ends Here
        </h2>
        <p className="font-serif-display text-amber-200/90 text-sm sm:text-base mt-1">
          Review your official ballot selections below before submitting
        </p>
      </div>

      {/* Radiant Glowing Butterfly Centerpiece & Submit Button */}
      <div className="relative my-3 flex flex-col items-center justify-center z-20 py-2 w-full">
        {/* Particle Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/30 via-white/40 to-amber-300/30 blur-3xl animate-pulse" />

        <div className="relative z-10 animate-float-slow my-2 scale-110 sm:scale-125">
          <ButterflyParticle type="white" size={110} />
        </div>

        {/* Large Glowing Submit Button matching Image 7 */}
        {!votingState.isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="group relative px-12 sm:px-16 py-4 sm:py-5 rounded-full bg-white/90 hover:bg-white text-gray-900 border-2 border-amber-300 font-sora font-extrabold text-3xl sm:text-4xl shadow-[0_0_50px_rgba(255,255,255,0.8)] hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center"
          >
            <span className="tracking-wide">Submit</span>
            <span className="font-sans-clean font-bold text-xs sm:text-sm text-amber-700 tracking-widest uppercase">
              Hugo Award 2026
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundFx.playClick();
              setShowReceiptModal(true);
            }}
            className="px-10 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-serif-display font-black text-2xl shadow-[0_0_40px_rgba(74,222,128,0.8)] hover:scale-105 transition-all cursor-pointer flex items-center space-x-2"
          >
            <Check className="w-8 h-8 stroke-[3]" />
            <span>Ballot Submitted! (View Receipt)</span>
          </button>
        )}
      </div>

      {/* On-Screen Ballot Summary Card */}
      <div className="w-full my-4 p-4 sm:p-5 rounded-3xl bg-black/85 backdrop-blur-2xl border border-amber-300/60 shadow-2xl z-20 text-left">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-300/40">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-display text-lg sm:text-xl font-bold text-amber-200">
              Official Voting Ballot Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans-clean">
          {ballotSummaryItems.map((item, idx) => {
            const canEdit = !votingState.isSubmitted;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl bg-white/5 border border-amber-300/30 flex flex-col justify-between transition-colors group ${
                  canEdit ? 'hover:border-amber-300 cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (canEdit) {
                    soundFx.playClick();
                    onNavigate(item.step);
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-extrabold flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {canEdit && (
                    <span className="text-[11px] text-amber-400 font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                      Edit ✏️
                    </span>
                  )}
                </div>
              
              <div className="space-y-1.5">
                {item.values.length > 0 ? (
                  item.values.map((valStr, valIdx) => (
                    <div key={valIdx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/10">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[0.65rem] flex items-center justify-center font-black shrink-0">
                        {valIdx + 1}
                      </span>
                      <span className="truncate">{valStr}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-amber-200/50 italic">Incomplete (1 required)</span>
                )}
              </div>
            </div>
          ); })}
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="w-full flex justify-center items-center pt-4 border-t border-amber-300/30 z-20">
        {votingState.isSubmitted ? (
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                setShowReceiptModal(true);
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-slate-950 font-sans-clean font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              Show Receipt 🗳️
            </button>
            {import.meta.env.VITE_ALLOW_REVOTE === 'true' && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  if (window.confirm("Bạn có chắc chắn muốn hủy phiếu bầu hiện tại để tiến hành chọn lại từ đầu? Số liệu vote cũ của bạn sẽ bị trừ khỏi bảng xếp hạng live.")) {
                    onReset();
                  }
                }}
                className="px-8 py-3 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 font-sans-clean font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                Revote 🔄
              </button>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('perfect_duo');
              }}
              className="px-6 py-2.5 rounded-full border-2 border-white/90 bg-black/60 hover:bg-black/80 text-white font-serif-display text-sm sm:text-base font-bold transition-all shadow-md cursor-pointer"
            >
              Back to Perfect Duo
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('best_member');
              }}
              className="px-6 py-2.5 rounded-full border-2 border-amber-300 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-serif-display text-sm sm:text-base font-bold transition-all shadow-md cursor-pointer"
            >
              Review Selections
            </button>
          </div>
        )}
      </div>

      {/* 200px - 300px Extra Bottom Scroll Space for Mobile Accessibility */}
      <div className="w-full h-48 sm:h-64 shrink-0 pointer-events-none" />

      {/* Ballot Submission Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in animate-duration-300">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl custom-scrollbar shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            <div
              ref={receiptRef}
              className="w-full border border-white/20 rounded-3xl p-6 sm:p-8 text-white text-left relative overflow-hidden backdrop-blur-2xl bg-[#101b13]"
            >
              {/* Close Button at top right */}
              <button
                type="button"
                data-html2canvas-ignore="true"
                onClick={() => {
                  soundFx.playClick();
                  setShowReceiptModal(false);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors border border-white/10 z-30 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Site Background Image (Explicit img tag for 100% html2canvas compatibility) */}
              <img
                src="/assets/bg.webp"
                alt="Hugo Meadow Background"
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              />

              {/* Dark Tint Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#101b13]/80 via-[#142318]/85 to-[#0a140d]/90 z-0 pointer-events-none" />

              {/* Light Effect Overlay */}
              <img
                src="/assets/effect.webp"
                alt="Hugo Light Effect"
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60 z-0 pointer-events-none"
              />

              <div className="relative z-10">
                {/* Modal Header */}
                <div className="text-center pb-4 border-b border-white/15">
                  <div className="inline-flex p-3 rounded-full bg-amber-400/20 border border-amber-400/50 mb-2 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    <Award className="w-8 h-8 text-amber-300" />
                  </div>
                  <h2 className="font-serif-display text-xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow">
                    Hugo Award 2026
                  </h2>
                  <p className="font-serif-display text-xs md:text-sm text-amber-200/90 italic mt-0.5">
                    Official Voting Ballot Receipt
                  </p>
                </div>

                {/* Voter Info & Ballot Selections */}
                <div className="my-6 space-y-2.5 font-serif-display text-sm sm:text-base">
                  <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                    <span className="text-amber-200/90 font-medium">Voter:</span>
                    <span className="font-bold text-white text-base">{votingState.userName || 'Anonymous'}</span>
                  </div>

                  {votingState.userEmail && (
                    <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                      <span className="text-amber-200/90 font-medium">Gmail / Email:</span>
                      <span className="font-bold text-emerald-300 text-xs sm:text-sm">{votingState.userEmail}</span>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                    <span className="text-amber-200/90 font-medium">Best Member:</span>
                    <span className="font-bold text-amber-300">{memberName}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                    <span className="text-amber-200/90 font-medium">Best Event:</span>
                    <span className="font-bold text-amber-300">{eventName}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                    <span className="text-amber-200/90 font-medium">The Rookie:</span>
                    <span className="font-bold text-amber-300">{rookieName}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/65 border border-amber-400/40 flex justify-between items-center shadow-lg backdrop-blur-md">
                    <span className="text-amber-200/90 font-medium">The Perfect Duo:</span>
                    <span className="font-bold text-amber-300">{duoName}</span>
                  </div>

                  {votingState.submittedAt && (
                    <div className="pt-1.5 text-center text-xs text-amber-300/80 font-sans-clean">
                      Submitted on: {new Date(votingState.submittedAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Modal Actions - Ignored during HTML2Canvas PNG capture */}
                <div data-html2canvas-ignore="true" className="space-y-3 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownloadPNG}
                      disabled={isDownloading}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-black font-serif-display font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50 shadow-[0_4px_15px_rgba(251,191,36,0.3)]"
                      title="Download ballot receipt as PNG image"
                    >
                      <Download className="w-4 h-4 text-black shrink-0" />
                      <span>{isDownloading ? 'Downloading...' : 'Download PNG'}</span>
                    </button>

                    <button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/35 font-serif-display font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Send confirmation email"
                    >
                      <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{isSendingEmail ? 'Sending...' : 'Email Receipt'}</span>
                    </button>
                  </div>

                  {emailNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 text-xs text-center animate-fade-in font-sans-clean font-bold shadow-md">
                      {emailNotice}
                    </div>
                  )}

                  {/* Secondary Close Button for better UX */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShowReceiptModal(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-serif-display font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    Close Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
