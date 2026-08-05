import { VotingState, HugoTeam } from '../types';
import { saveBallotToFirestore } from './firebase';

const VOTE_ROUND = import.meta.env.VITE_VOTE_ROUND || '1';
const STORAGE_KEY_SAVED_BALLOTS = `hugo_award_saved_ballots_map_2026_r${VOTE_ROUND}`;
const STORAGE_KEY_CURRENT_VOTE = `hugo_award_2026_user_state_r${VOTE_ROUND}`;

export interface SavedBallotRecord {
  userEmail?: string;
  userName: string;
  userAvatar?: string;
  selectedTeam: HugoTeam | null;
  selectedBestMember: string[] | string | null;
  selectedBestEvent: string[] | string | null;
  selectedRookie: string[] | string | null;
  selectedDuo: string[] | string | null;
  isSubmitted: boolean;
  submittedAt?: string;
}

export function getAllSavedBallots(): Record<string, SavedBallotRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_BALLOTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading saved ballots map', e);
  }
  return {};
}

export function getSavedBallotForUser(email?: string, name?: string): SavedBallotRecord | null {
  const map = getAllSavedBallots();
  if (email && map[email.toLowerCase()]) {
    return map[email.toLowerCase()];
  }
  if (name && map[name.toLowerCase()]) {
    return map[name.toLowerCase()];
  }
  return null;
}

export async function saveUserBallot(state: VotingState) {
  if (!state.userName && !state.userEmail) return;

  const key = (state.userEmail || state.userName).toLowerCase();
  const record: SavedBallotRecord = {
    userEmail: state.userEmail,
    userName: state.userName,
    userAvatar: state.userAvatar,
    selectedTeam: state.selectedTeam,
    selectedBestMember: state.selectedBestMember,
    selectedBestEvent: state.selectedBestEvent,
    selectedRookie: state.selectedRookie,
    selectedDuo: state.selectedDuo,
    isSubmitted: state.isSubmitted,
    submittedAt: state.submittedAt || (state.isSubmitted ? new Date().toISOString() : undefined)
  };

  // 1. Save to local storage map (keyed by gmail/email or username)
  try {
    const map = getAllSavedBallots();
    map[key] = record;
    if (state.userName) {
      map[state.userName.toLowerCase()] = record;
    }
    localStorage.setItem(STORAGE_KEY_SAVED_BALLOTS, JSON.stringify(map));
    localStorage.setItem(STORAGE_KEY_CURRENT_VOTE, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving ballot map to localStorage', e);
  }

  // 2. Sync to Firestore if configured
  await saveBallotToFirestore(record);
}
