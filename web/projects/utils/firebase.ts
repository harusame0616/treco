import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBx_Dzg_wXFZSWxiDDMBtRk8ctOP1mctTQ',
  authDomain: 'treco-prd.firebaseapp.com',
  projectId: 'treco-prd',
  storageBucket: 'treco-prd.appspot.com',
  messagingSenderId: '299620451484',
  appId: '1:299620451484:web:de888b048022822dc35959',
};

const app = initializeApp(firebaseConfig);

const fbDb = getFirestore();
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
  enableMultiTabIndexedDbPersistence(fbDb);
}

export { fbDb, fbAuth };
