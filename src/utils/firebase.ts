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
import { TeamMoment } from '../types';

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
