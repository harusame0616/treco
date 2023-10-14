"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginCheck() {
  const { isLoading, isAuthenticated, getIdToken, signOut } = useAuth();
  const [isPushed, setIsPushed] = useState(false); // 開発環境で２重で遷移するのを避ける
  const router = useRouter();

  useEffect(() => {
    if (isPushed || !router || !getIdToken || isLoading || !isAuthenticated) {
      return;
    }

    getIdToken().then((idToken) => {
      fetch("/api/session/start", {
        method: "POST",
        body: JSON.stringify({
          id: idToken,
        }),
      })
        .then(() => {
          setIsPushed(true);
          router.refresh();
        })
        .catch(() => {
          signOut();
        });
    });
  }, [isLoading, isAuthenticated, isPushed, getIdToken, router]);

  return null;
}
