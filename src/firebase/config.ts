import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore, setLogLevel } from 'firebase/firestore';

// Silence verbose connection retry logs from Firestore in the browser console
try {
  setLogLevel('silent');
} catch {
  // ignore
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZEQdCMGNKMvbla9Nf1Mz6R4stLh2-vEs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jplearningbd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jplearningbd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jplearningbd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "985428999353",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:985428999353:web:aa2fa66f7981f13ba96f68"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== ''
);

// Cloud Firestore is only enabled if explicitly configured with an active database
export const isFirestoreEnabled = Boolean(
  isFirebaseConfigured &&
  import.meta.env.VITE_FIREBASE_FIRESTORE_ENABLED === 'true'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Only instantiate Firestore if explicitly enabled; otherwise rely on the app's full local & server database fallback
    if (isFirestoreEnabled) {
      db = getFirestore(app);
    } else {
      db = null;
    }
    console.log('🔥 Firebase Auth initialized successfully for Chandu Japanese School');
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
  }
} else {
  console.info('ℹ️ Running with local persistent storage fallback (Firebase credentials not set). All features & progress fully functional.');
}

export { app, auth, db, googleProvider };
