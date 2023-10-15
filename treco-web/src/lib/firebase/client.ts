import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

import firebaseConfig from './settings/firebase-config.json';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig || config);

declare global {
  // eslint-disable-next-line no-var
  var fbAuth: ReturnType<typeof getAuth> | undefined;
}

const fbAuth = getAuth();

if (
  process.env.NEXT_PUBLIC_AUTH_EMULATOR === 'use' &&
  typeof location == 'object'
) {
  if (!fbAuth.emulatorConfig) {
    connectAuthEmulator(fbAuth, `http://${location.hostname}:9099/`, {
      disableWarnings: true,
    });
  }
}

// エラーが発生するため
if (typeof window == 'object') {
  if (process.env.NODE_ENV === 'production') {
    getAnalytics(app);
  }
}

export { fbAuth };
