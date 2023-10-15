'use client';

import { createContext } from 'react';

import { useAuthContext } from './useAuthContext';

export const AuthContext = createContext<ReturnType<
  typeof useAuthContext
> | null>(null);
