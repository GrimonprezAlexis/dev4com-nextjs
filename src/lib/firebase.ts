import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUlU1esFktMUK0TgJIqCww7xkGCqTU3cs",
  authDomain: "dev4com-f68e3.firebaseapp.com",
  projectId: "dev4com-f68e3",
  storageBucket: "dev4com-f68e3.firebasestorage.app",
  messagingSenderId: "634868566361",
  appId: "1:634868566361:web:ea1a3efef52666b455e448",
  measurementId: "G-3D57QJVRBN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, storage, analytics, auth };