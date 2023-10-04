import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const firebaseConfig = require('./settings/firebase-config.json');

const app = initializeApp(firebaseConfig);

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
    const analytics = getAnalytics(app);
  }
}

export { fbAuth };
