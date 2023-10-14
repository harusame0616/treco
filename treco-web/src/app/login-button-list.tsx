"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export function LoginButtonList() {
  const auth = useAuth();

  const providers = [
    {
      id: "google",
      label: "Google",
    },
    {
      id: "twitter",
      label: "X (Twitter)",
    },
    {
      id: "facebook",
      label: "facebook",
    },
  ] as const;

  return (
    <ul aria-label="ソーシャルログイン" className="flex flex-col gap-1">
      {providers.map(({ id, label }) => (
        <li key={id} aria-label={label}>
          <Button
            onClick={() => auth.signInWith(id)}
            className="w-48 font-bold"
          >
            {label} でログイン
          </Button>
        </li>
      ))}
      <Button
        variant="ghost"
        className="text-primary text-xs"
        onClick={() => auth.signInAnonymously()}
      >
        登録せず開始する
      </Button>
    </ul>
  );
}
