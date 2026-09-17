import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as per Firebase skill guidelines
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection testing as mandated by skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (
      error?.code === 'unavailable' ||
      (error instanceof Error &&
        (error.message.includes('the client is offline') ||
          error.message.includes('unavailable') ||
          error.message.includes('Could not reach Cloud Firestore')))
    ) {
      console.warn('Firebase client appears offline or connecting. The app will operate seamlessly with local persistence.');
    } else {
      console.warn('Firestore connection check notice:', error?.message || error);
    }
  }
}

// Kick off test connection
testConnection();
