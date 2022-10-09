import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence, initializeFirestore
} from 'firebase/firestore';

const firebaseConfig = require('./settings/firebase-config.json');

const app = initializeApp(firebaseConfig, {});


const fbDb = initializeFirestore(app, {
  experimentalForceLongPolling:
    typeof window == 'object' && (window as any)?.Cypress ? true : false,
});
// const fbDb = getFirestore();


const fbAuth = getAuth();

if (process.env.NODE_ENV === 'development' && typeof location == 'object') {
  connectFirestoreEmulator(fbDb, location.hostname, 8080);
  if (!fbAuth.emulatorConfig) {
    connectAuthEmulator(fbAuth, `http://${location.hostname}:9099/`, {
      disableWarnings: true,
    });
  }
}

// エラーが発生するため
// connectFirestoreEmulatorの後でクライアントサイドでのみ設定
if (typeof window == 'object') {
  if (process.env.NODE_ENV === 'production') {
    const analytics = getAnalytics(app);
  }
  enableMultiTabIndexedDbPersistence(fbDb);
}

export { fbDb, fbAuth };
