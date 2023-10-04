'use client';

import { fbAuth } from '@/lib/firebase/client';
import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInAnonymously as _signInAnonymously,
  getIdToken,
  linkWithRedirect,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { useLayoutEffect, useState } from 'react';

const oAuthProviderNames = ['google', 'twitter', 'facebook'] as const;
export type OAuthProviderName = (typeof oAuthProviderNames)[number];
const isProviderName = (value: any): value is OAuthProviderName =>
  oAuthProviderNames.includes(value);

const providerMappedProviderName: { [key in OAuthProviderName]: AuthProvider } =
  {
    google: new GoogleAuthProvider(),
    twitter: new TwitterAuthProvider(),
    facebook: new FacebookAuthProvider(),
  };

interface Auth {
  authId?: string;
  isAnonymous?: boolean;
}

export function useAuthContext() {
  let [isLoading, setIsLoading] = useState(true);
  let isError = false;
  const [auth, setAuth] = useState<Auth>({});
  const isAuthenticated = !!auth.authId;

  const signInWith = async (providerName: OAuthProviderName) => {
    if (!isProviderName(providerName)) {
      throw new Error('providerName error: ', providerName);
    }

    await signInWithRedirect(fbAuth, providerMappedProviderName[providerName]);
  };

  const signInAnonymously = async () => {
    const credential = await _signInAnonymously(fbAuth);
    setAuth({
      authId: credential.user.uid,
      isAnonymous: true,
    });
  };

  const linkWith = async (providerName: OAuthProviderName) => {
    if (!isProviderName(providerName)) {
      throw new Error('providerName error: ', providerName);
    }

    if (fbAuth.currentUser == null) {
      throw new Error('currentUser is null');
    }

    if (!fbAuth.currentUser.isAnonymous) {
      throw new Error('currentUser is no anonymous');
    }

    await linkWithRedirect(
      fbAuth.currentUser,
      providerMappedProviderName[providerName]
    );
  };

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, async (user) => {
      if (user) {
        setAuth({ authId: user.uid, isAnonymous: user.isAnonymous });
      }

      setIsLoading(false);
      unsubscribe();
    });
  }, []);

  return {
    isLoading,
    isError,
    auth,
    signInWith,
    isAuthenticated,
    signInAnonymously,
    linkWith,
    signOut: async () => {
      await signOut(fbAuth);
      setAuth({});
    },
    getIdToken: async () => {
      const user = fbAuth.currentUser;
      if (!user) {
        return null;
      }

      return getIdToken(user);
    },
  };
}
