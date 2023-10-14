import { useContext } from 'react';

import { AuthContext } from './context';

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext is not provided');
  }
  return authContext;
}
