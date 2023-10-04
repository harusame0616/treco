import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin Config');
  }
  return { projectId, clientEmail, privateKey };
}

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: cert(getFirebaseAdminConfig()),
  });

export const auth = getAuth();
