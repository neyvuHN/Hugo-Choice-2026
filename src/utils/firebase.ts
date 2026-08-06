import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, collection, onSnapshot, Firestore } from 'firebase/firestore';
import { TeamMoment, LiveResultsData } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hugochoice.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hugochoice',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
export let db: Firestore | null = null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Failed to initialize Firebase:", error);
  }
}

const VOTE_ROUND = import.meta.env.VITE_VOTE_ROUND || '1';

export const saveBallotToFirestore = async (ballotData: any) => {
  if (!db) return;
  try {
    const docId = (ballotData.userEmail || ballotData.userName || 'anonymous')
      .toLowerCase()
      .replace(/[^a-z0-9_@.-]/g, '_');
    await setDoc(doc(db, `ballots_r${VOTE_ROUND}`, docId), {
      ...ballotData,
      round: VOTE_ROUND,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save ballot to Firestore:", err);
  }
};

export const saveMomentToFirestore = async (moment: TeamMoment) => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'moments', moment.id), {
      ...moment,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save moment to Firestore:", err);
  }
};

export const deleteMomentFromFirestore = async (momentId: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'moments', momentId));
  } catch (err) {
    console.warn("Could not delete moment from Firestore:", err);
  }
};

export const subscribeToMomentsFirestore = (onMomentsUpdate: (moments: TeamMoment[]) => void) => {
  if (!db) return () => {};
  try {
    const momentsRef = collection(db, 'moments');
    return onSnapshot(momentsRef, (snapshot) => {
      const momentsList: TeamMoment[] = [];
      snapshot.forEach((doc) => {
        momentsList.push(doc.data() as TeamMoment);
      });
      if (momentsList.length > 0) {
        onMomentsUpdate(momentsList);
      }
    });
  } catch (err) {
    console.warn("Firestore moments subscription notice:", err);
    return () => {};
  }
};

const INITIAL_RESULTS: LiveResultsData = {
  totalSubmissions: 0,
  teams: { prs: 0, hc: 0, bnn: 0, niff: 0 },
  bestMember: {},
  bestEvent: {},
  rookie: {},
  perfectDuo: {},
};

/**
 * Subscribe to ballots_r{round} collection in Firestore and compute
 * aggregated vote counts in real-time. Calls onUpdate whenever any ballot changes.
 */
export const subscribeToBallotsFirestore = (
  onUpdate: (results: LiveResultsData) => void
) => {
  if (!db) return () => {};
  try {
    const collectionName = `ballots_r${VOTE_ROUND}`;
    const ballotsRef = collection(db, collectionName);
    return onSnapshot(ballotsRef, (snapshot) => {
      const results: LiveResultsData = {
        totalSubmissions: 0,
        teams: { prs: 0, hc: 0, bnn: 0, niff: 0 },
        bestMember: {},
        bestEvent: {},
        rookie: {},
        perfectDuo: {},
      };

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Only count submitted ballots
        if (!data.isSubmitted) return;

        results.totalSubmissions += 1;

        // Team
        if (data.selectedTeam) {
          const t = data.selectedTeam as string;
          results.teams[t as keyof typeof results.teams] =
            (results.teams[t as keyof typeof results.teams] || 0) + 1;
        }

        // Best Member (array or string)
        const members: string[] = Array.isArray(data.selectedBestMember)
          ? data.selectedBestMember
          : data.selectedBestMember ? [data.selectedBestMember] : [];
        members.forEach((id: string) => {
          results.bestMember[id] = (results.bestMember[id] || 0) + 1;
        });

        // Best Event (array or string)
        const events: string[] = Array.isArray(data.selectedBestEvent)
          ? data.selectedBestEvent
          : data.selectedBestEvent ? [data.selectedBestEvent] : [];
        events.forEach((id: string) => {
          results.bestEvent[id] = (results.bestEvent[id] || 0) + 1;
        });

        // Rookie (array or string)
        const rookies: string[] = Array.isArray(data.selectedRookie)
          ? data.selectedRookie
          : data.selectedRookie ? [data.selectedRookie] : [];
        rookies.forEach((id: string) => {
          results.rookie[id] = (results.rookie[id] || 0) + 1;
        });

        // Perfect Duo (array or string)
        const duos: string[] = Array.isArray(data.selectedDuo)
          ? data.selectedDuo
          : data.selectedDuo ? [data.selectedDuo] : [];
        duos.forEach((id: string) => {
          results.perfectDuo[id] = (results.perfectDuo[id] || 0) + 1;
        });
      });

      onUpdate(results);
    }, (err) => {
      console.warn('Firestore ballots subscription error:', err);
    });
  } catch (err) {
    console.warn('Firestore ballots subscription notice:', err);
    return () => {};
  }
};


export interface GoogleUserProfile {
  name: string;
  email: string;
  avatar: string;
  uid?: string;
}

const extractUserProfile = (user: User): GoogleUserProfile => {
  return {
    name: user.displayName || user.email?.split('@')[0] || 'Google User',
    email: user.email || '',
    avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || user.email || 'User')}`,
    uid: user.uid
  };
};

export const signInWithGoogle = async (): Promise<GoogleUserProfile> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Cấu hình Firebase chưa đủ trong .env (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID)"
    );
  }

  // 1. Try Popup
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return extractUserProfile(result.user);
  } catch (popupError: any) {
    console.warn("signInWithPopup error code:", popupError?.code, popupError?.message);

    // If popup is closed/blocked by browser, fallback to redirect
    if (
      popupError?.code === 'auth/popup-closed-by-user' ||
      popupError?.code === 'auth/popup-blocked' ||
      popupError?.code === 'auth/cancelled-popup-request' ||
      popupError?.code === 'auth/internal-error' ||
      /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
    ) {
      try {
        console.log("Switching to signInWithRedirect...");
        await signInWithRedirect(auth, googleProvider);
        throw new Error("Đang chuyển hướng tới trang đăng nhập Google...");
      } catch (redirectError: any) {
        throw redirectError;
      }
    }

    throw popupError;
  }
};

export const signInWithGoogleRedirect = async (): Promise<void> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Cấu hình Firebase chưa đủ trong .env (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID)"
    );
  }
  await signInWithRedirect(auth, googleProvider);
};

export const logoutGoogle = async (): Promise<void> => {
  if (auth) {
    await firebaseSignOut(auth);
  }
};

export const subscribeToAuthChanges = (
  onUserChanged: (userProfile: GoogleUserProfile | null) => void
) => {
  if (!auth) {
    onUserChanged(null);
    return () => {};
  }

  // Handle redirect result if user returned from signInWithRedirect
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        onUserChanged(extractUserProfile(result.user));
      }
    })
    .catch((err) => {
      console.warn("getRedirectResult notice:", err);
    });

  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      onUserChanged(extractUserProfile(user));
    } else {
      onUserChanged(null);
    }
  });
};

/**
 * Subscribe to the voting configuration document in Firestore.
 * If document doesn't exist or isFirebaseConfigured is false, default to false (voting open).
 */
export const subscribeToVotingStatus = (onUpdate: (isClosed: boolean) => void) => {
  if (!db) {
    onUpdate(false);
    return () => {};
  }
  try {
    const docRef = doc(db, 'config', 'voting');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(Boolean(data.isVotingClosed));
      } else {
        onUpdate(false);
      }
    }, (err) => {
      console.warn("Firestore voting status subscription error:", err);
      onUpdate(false);
    });
  } catch (err) {
    console.warn("Firestore voting status subscription notice:", err);
    onUpdate(false);
    return () => {};
  }
};

/**
 * Update the voting status document in Firestore.
 */
export const updateVotingStatus = async (isClosed: boolean) => {
  if (!db) return;
  try {
    const docRef = doc(db, 'config', 'voting');
    await setDoc(docRef, { isVotingClosed: isClosed }, { merge: true });
  } catch (err) {
    console.error("Could not update voting status in Firestore:", err);
    throw err;
  }
};

