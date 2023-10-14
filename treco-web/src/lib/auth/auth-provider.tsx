"use client";

import { PropsWithChildren } from "react";

import { AuthContext } from "./context";
import { useAuthContext } from "./useAuthContext";

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useAuthContext();

  if (!auth) {
    throw new Error("Auth Context did not provide");
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
