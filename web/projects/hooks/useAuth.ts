import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import { useLayoutEffect, useState } from 'react';
import { fbAuth } from '../utils/firebase';

const oAuthProviderNames = ['google'] as const;
type OAuthProviderName = typeof oAuthProviderNames[number];
const isProviderName = (value: any): value is OAuthProviderName =>
  oAuthProviderNames.includes(value);

const providerMappedProviderName = {
  google: new GoogleAuthProvider(),
};

interface Auth {
  authId?: string;
}

const useAuth = () => {
  let [isLoading, setIsLoading] = useState(true);
  let isError = false;
  const [auth, setAuth] = useState<Auth>({});
  const isAuthenticated = !!auth.authId;

  const siginInWith = async (providerName: OAuthProviderName) => {
    if (!isProviderName(providerName)) {
      throw new Error('providerName error: ', providerName);
    }

    signInWithRedirect(fbAuth, providerMappedProviderName[providerName]);
  };

  useLayoutEffect(() => {
    const unscribe = onAuthStateChanged(fbAuth, async (user) => {
      if (user) {
        setAuth({ authId: user.uid });
      }

      setIsLoading(false);
      unscribe();
    });
  }, []);

  return { isLoading, isError, auth, siginInWith, isAuthenticated };
};

export default useAuth;
