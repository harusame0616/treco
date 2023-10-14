"use client";

import { PropsWithChildren } from "react";
import { useAuthContext } from "./useAuthContext";
import { AuthContext } from "./context";

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useAuthContext();

  if (!auth) {
    throw new Error("Auth Context did not provide");
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
