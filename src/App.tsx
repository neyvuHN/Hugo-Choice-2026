import React, { useState, useEffect } from 'react';
import { ScreenStep, VotingState, LiveResultsData } from './types';
import { INITIAL_LIVE_RESULTS } from './data/mockData';
import { BackgroundLandscape } from './components/BackgroundLandscape';
import { Header } from './components/Header';
import { BallotDrawer } from './components/BallotDrawer';
import { AdminLeaderboardModal } from './components/AdminLeaderboardModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import {
  subscribeToAuthChanges,
  logoutGoogle,
  subscribeToBallotsFirestore,
  subscribeToVotingStatus,
  updateVotingStatus
} from './utils/firebase';
import { saveUserBallot, getSavedBallotForUser } from './utils/ballotStorage';
import { ToastContainer } from './components/ToastContainer';
import { GlitterEffectOverlay } from './components/GlitterEffectOverlay';
import { preloadVideos, extractVideoUrls } from './utils/videoPreloader';
import { ROUND2_BEST_MEMBERS, ROUND2_ROOKIES, ROUND2_EVENTS, ROUND2_DUOS } from './data/round2Data';

import { LandingScreen } from './components/screens/LandingScreen';
import { ProcessModalScreen } from './components/screens/ProcessModalScreen';
import { NameInputScreen } from './components/screens/NameInputScreen';
import { TeamSelectionScreen } from './components/screens/TeamSelectionScreen';
import { BestMemberScreen } from './components/screens/BestMemberScreen';
import { BestEventScreen } from './components/screens/BestEventScreen';
import { RookieScreen } from './components/screens/RookieScreen';
import { PerfectDuoScreen } from './components/screens/PerfectDuoScreen';
import { SubmissionScreen } from './components/screens/SubmissionScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { VotingClosedScreen } from './components/screens/VotingClosedScreen';

const VOTE_ROUND = import.meta.env.VITE_VOTE_ROUND || '1';
const STORAGE_KEY_VOTE = `hugo_award_2026_user_state_r${VOTE_ROUND}`;
const STORAGE_KEY_RESULTS = `hugo_award_2026_live_results_r${VOTE_ROUND}`;

function toArr(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') return [val];
  return [];
}

// Preload all nominee videos at startup (Disabled to save Cloudinary/Hosting bandwidth)
/*
function preloadAllNomineeVideos() {
  const allCandidates = [
    ...Object.values(ROUND2_BEST_MEMBERS).flat(),
    ...ROUND2_ROOKIES,
    ...ROUND2_EVENTS,
    ...ROUND2_DUOS,
  ];
  // Stagger slightly so we don't hammer bandwidth all at once
  setTimeout(() => preloadVideos(extractVideoUrls(allCandidates)), 2000);
}
*/

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('landing');
  const [isBallotDrawerOpen, setIsBallotDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  // Voting State
  const [votingState, setVotingState] = useState<VotingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          selectedBestMember: toArr(parsed.selectedBestMember),
          selectedBestEvent: toArr(parsed.selectedBestEvent),
          selectedRookie: toArr(parsed.selectedRookie),
          selectedDuo: toArr(parsed.selectedDuo)
        };
      }
    } catch {
      // Fallback
    }
    return {
      userName: '',
      selectedTeam: null,
      selectedBestMember: [],
      selectedBestEvent: [],
      selectedRookie: [],
      selectedDuo: [],
      isSubmitted: false
    };
  });

  // Live Results Tally
  const [liveResults, setLiveResults] = useState<LiveResultsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_LIVE_RESULTS;
  });

  // Save voting state to localStorage and sync per user (gmail/name + ballot)
  useEffect(() => {
    try {
      if (votingState.userName || votingState.userEmail) {
        saveUserBallot(votingState);
      }
    } catch {
      // Ignore
    }
  }, [votingState]);

  // Preload all nominee videos early so they're buffered before user reaches voting screens (Disabled to save bandwidth)
  /*
  useEffect(() => {
    preloadAllNomineeVideos();
  }, []);
  */

  // Subscribe to Firestore ballots collection for real-time live stats
  useEffect(() => {
    const unsubscribe = subscribeToBallotsFirestore((realResults) => {
      setLiveResults(realResults);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Subscribe to real-time voting status (open/closed) from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToVotingStatus((closed) => {
      setIsVotingClosed(closed);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Route Guard: Redirect non-admin users to voting_closed screen if voting is closed
  useEffect(() => {
    const isAdmin = votingState.userEmail?.toLowerCase() === 'hugoclub.dut@gmail.com';
    if (isVotingClosed && !isAdmin) {
      if (currentStep !== 'voting_closed') {
        navigateTo('voting_closed');
      }
    } else if (!isVotingClosed && currentStep === 'voting_closed') {
      navigateTo('landing');
    }
  }, [isVotingClosed, votingState.userEmail, currentStep]);

  const handleToggleVotingStatus = async (closed: boolean) => {
    try {
      await updateVotingStatus(closed);
    } catch (err) {
      console.error("Failed to update voting status:", err);
    }
  };

  // Handle restoring or linking ballot for a logged in Google user
  const handleUserLogin = (user: { name: string; email: string; avatar: string }) => {
    const existingBallot = getSavedBallotForUser(user.email, user.name);
    if (existingBallot) {
      setVotingState({
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar,
        selectedTeam: existingBallot.selectedTeam as any,
        selectedBestMember: toArr(existingBallot.selectedBestMember),
        selectedBestEvent: toArr(existingBallot.selectedBestEvent),
        selectedRookie: toArr(existingBallot.selectedRookie),
        selectedDuo: toArr(existingBallot.selectedDuo),
        isSubmitted: existingBallot.isSubmitted,
        submittedAt: existingBallot.submittedAt
      });
      if (existingBallot.isSubmitted) {
        navigateTo('submission');
      }
    } else {
      setVotingState(prev => ({
        ...prev,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar
      }));
    }
  };

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        handleUserLogin(firebaseUser);
      } else {
        // If unauthenticated or login closed/failed, ensure state reflects NOT logged in
        setVotingState(prev => {
          if (prev.userEmail || prev.userAvatar) {
            return {
              ...prev,
              userEmail: undefined,
              userAvatar: undefined
            };
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Step Navigation Helper
  const navigateTo = (step: ScreenStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Ballot Handler
  const handleSubmitBallot = () => {
    if (votingState.isSubmitted) return;

    setVotingState(prev => ({
      ...prev,
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    }));

    // Increment live results
    setLiveResults(prev => {
      const next = { ...prev, totalSubmissions: prev.totalSubmissions + 1 };

      if (votingState.selectedTeam) {
        next.teams = {
          ...next.teams,
          [votingState.selectedTeam]: (next.teams[votingState.selectedTeam] || 0) + 1
        };
      }

      const bmNext = { ...next.bestMember };
      votingState.selectedBestMember.forEach(id => {
        bmNext[id] = (bmNext[id] || 0) + 1;
      });
      next.bestMember = bmNext;

      const beNext = { ...next.bestEvent };
      votingState.selectedBestEvent.forEach(id => {
        beNext[id] = (beNext[id] || 0) + 1;
      });
      next.bestEvent = beNext;

      const rookieNext = { ...next.rookie };
      votingState.selectedRookie.forEach(id => {
        rookieNext[id] = (rookieNext[id] || 0) + 1;
      });
      next.rookie = rookieNext;

      const duoNext = { ...next.perfectDuo };
      votingState.selectedDuo.forEach(id => {
        duoNext[id] = (duoNext[id] || 0) + 1;
      });
      next.perfectDuo = duoNext;

      return next;
    });
  };

  // Clear Current User's Ballot (Revote)
  const handleClearMyBallot = () => {
    if (!votingState.isSubmitted) {
      setVotingState(prev => ({
        ...prev,
        selectedTeam: null,
        selectedBestMember: [],
        selectedBestEvent: [],
        selectedRookie: [],
        selectedDuo: []
      }));
      navigateTo('best_member');
      setIsAdminModalOpen(false);
      return;
    }

    // Decrement live results
    setLiveResults(prev => {
      const nextTotal = Math.max(0, prev.totalSubmissions - 1);
      const next = { ...prev, totalSubmissions: nextTotal };

      if (votingState.selectedTeam && next.teams[votingState.selectedTeam]) {
        const val = Math.max(0, next.teams[votingState.selectedTeam] - 1);
        const newTeams = { ...next.teams };
        if (val > 0) newTeams[votingState.selectedTeam] = val;
        else delete newTeams[votingState.selectedTeam];
        next.teams = newTeams;
      }

      const newBM = { ...next.bestMember };
      votingState.selectedBestMember.forEach(id => {
        if (newBM[id]) {
          const val = Math.max(0, newBM[id] - 1);
          if (val > 0) newBM[id] = val;
          else delete newBM[id];
        }
      });
      next.bestMember = newBM;

      const newBE = { ...next.bestEvent };
      votingState.selectedBestEvent.forEach(id => {
        if (newBE[id]) {
          const val = Math.max(0, newBE[id] - 1);
          if (val > 0) newBE[id] = val;
          else delete newBE[id];
        }
      });
      next.bestEvent = newBE;

      const newRookies = { ...next.rookie };
      votingState.selectedRookie.forEach(id => {
        if (newRookies[id]) {
          const val = Math.max(0, newRookies[id] - 1);
          if (val > 0) newRookies[id] = val;
          else delete newRookies[id];
        }
      });
      next.rookie = newRookies;

      const newDuos = { ...next.perfectDuo };
      votingState.selectedDuo.forEach(id => {
        if (newDuos[id]) {
          const val = Math.max(0, newDuos[id] - 1);
          if (val > 0) newDuos[id] = val;
          else delete newDuos[id];
        }
      });
      next.perfectDuo = newDuos;

      return next;
    });

    // Reset user state to allow re-voting but keep identity
    setVotingState(prev => ({
      ...prev,
      selectedTeam: null,
      selectedBestMember: [],
      selectedBestEvent: [],
      selectedRookie: [],
      selectedDuo: [],
      isSubmitted: false,
      submittedAt: undefined
    }));
    
    navigateTo('best_member');
    setIsAdminModalOpen(false);
  };

  // Reset & Logout Ballot Handler
  const handleReset = async () => {
    try {
      await logoutGoogle();
    } catch {
      // Ignore
    }
    setVotingState({
      userName: '',
      userEmail: undefined,
      userAvatar: undefined,
      selectedTeam: null,
      selectedBestMember: [],
      selectedBestEvent: [],
      selectedRookie: [],
      selectedDuo: [],
      isSubmitted: false
    });
    localStorage.removeItem(STORAGE_KEY_VOTE);
    navigateTo('landing');
  };

  return (
    <BackgroundLandscape>
      {/* Global Glitter Canvas Effect */}
      <GlitterEffectOverlay />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Site Header */}
      <Header
        currentStep={currentStep}
        votingState={votingState}
        onNavigate={navigateTo}
        onOpenBallotDrawer={() => setIsBallotDrawerOpen(true)}
        onOpenAdminLeaderboard={() => navigateTo('statistics')}
        onOpenGoogleLogin={() => setIsGoogleAuthOpen(true)}
        onReset={handleReset}
        onLogout={handleReset}
      />

      {/* Screen Views */}
      <main className="flex-1 flex flex-col justify-between w-full min-h-0 overflow-x-hidden">
        {currentStep === 'landing' && (
          <LandingScreen
            userName={votingState.userName}
            onStart={() => {
              if (votingState.isSubmitted) {
                navigateTo('submission');
              } else {
                navigateTo('process');
              }
            }}
            onRequireLogin={() => setIsGoogleAuthOpen(true)}
          />
        )}

        {currentStep === 'process' && (
          <ProcessModalScreen
            onProceed={() => navigateTo('name_input')}
          />
        )}

        {currentStep === 'name_input' && (
          <NameInputScreen
            initialName={votingState.userName}
            onBack={() => navigateTo('process')}
            onNext={(name) => {
              const existingBallot = getSavedBallotForUser(votingState.userEmail, name);
              if (existingBallot) {
                setVotingState({
                  userName: name,
                  userEmail: votingState.userEmail,
                  userAvatar: votingState.userAvatar,
                  selectedTeam: existingBallot.selectedTeam as any,
                  selectedBestMember: toArr(existingBallot.selectedBestMember),
                  selectedBestEvent: toArr(existingBallot.selectedBestEvent),
                  selectedRookie: toArr(existingBallot.selectedRookie),
                  selectedDuo: toArr(existingBallot.selectedDuo),
                  isSubmitted: existingBallot.isSubmitted,
                  submittedAt: existingBallot.submittedAt
                });
                if (existingBallot.isSubmitted) {
                  navigateTo('submission');
                  return;
                }
              } else {
                setVotingState(prev => ({
                  ...prev,
                  userName: name
                }));
              }
              navigateTo('team_selection');
            }}
          />
        )}

        {currentStep === 'team_selection' && (
          <TeamSelectionScreen
            selectedTeam={votingState.selectedTeam}
            userName={votingState.userName}
            onSelectTeam={(team) => setVotingState(prev => ({ ...prev, selectedTeam: team }))}
            onBack={() => navigateTo('name_input')}
            onNext={() => navigateTo('best_member')}
          />
        )}

        {currentStep === 'best_member' && (
          <BestMemberScreen
            selectedCandidateIds={votingState.selectedBestMember}
            userTeam={votingState.selectedTeam}
            userName={votingState.userName}
            onSelectCandidates={(ids) => setVotingState(prev => ({ ...prev, selectedBestMember: ids }))}
            onBack={() => navigateTo('team_selection')}
            onNext={() => navigateTo('best_event')}
            onNavigate={navigateTo}
          />
        )}

        {currentStep === 'best_event' && (
          <BestEventScreen
            selectedEventIds={votingState.selectedBestEvent}
            userName={votingState.userName}
            onSelectEvents={(ids) => setVotingState(prev => ({ ...prev, selectedBestEvent: ids }))}
            onBack={() => navigateTo('best_member')}
            onNext={() => navigateTo('rookie')}
            onNavigate={navigateTo}
          />
        )}

        {currentStep === 'rookie' && (
          <RookieScreen
            selectedRookieIds={votingState.selectedRookie}
            userTeam={votingState.selectedTeam}
            userName={votingState.userName}
            onSelectRookies={(ids) => setVotingState(prev => ({ ...prev, selectedRookie: ids }))}
            onBack={() => navigateTo('best_event')}
            onNext={() => navigateTo('perfect_duo')}
            onNavigate={navigateTo}
          />
        )}

        {currentStep === 'perfect_duo' && (
          <PerfectDuoScreen
            selectedDuoIds={votingState.selectedDuo}
            userName={votingState.userName}
            onSelectDuos={(duos) => setVotingState(prev => ({ ...prev, selectedDuo: duos }))}
            onBack={() => navigateTo('rookie')}
            onNext={() => navigateTo('submission')}
            onNavigate={navigateTo}
          />
        )}

        {currentStep === 'submission' && (
          <SubmissionScreen
            votingState={votingState}
            onSubmitBallot={handleSubmitBallot}
            onNavigate={navigateTo}
            onReset={handleClearMyBallot}
            onOpenLeaderboard={() => navigateTo('statistics')}
          />
        )}

        {currentStep === 'voting_closed' && (
          <VotingClosedScreen />
        )}

        {currentStep === 'statistics' && (
          <StatisticsScreen
            results={liveResults}
            onBack={() => {
              if (isVotingClosed) {
                navigateTo('voting_closed');
              } else {
                navigateTo('landing');
              }
            }}
            votingState={votingState}
            isVotingClosed={isVotingClosed}
            onToggleVotingStatus={handleToggleVotingStatus}
          />
        )}
      </main>

      {/* Drawer: Ballot Review */}
      <BallotDrawer
        isOpen={isBallotDrawerOpen}
        onClose={() => setIsBallotDrawerOpen(false)}
        votingState={votingState}
        onNavigate={navigateTo}
      />

      {/* Modal: Admin Live Leaderboard */}
      <AdminLeaderboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        results={liveResults}
        onClearMyBallot={handleClearMyBallot}
      />

      {/* Modal: Google Authentication */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        isVotingClosed={isVotingClosed}
        onLoginSuccess={(user) => {
          handleUserLogin(user);
        }}
      />
    </BackgroundLandscape>
  );
}
