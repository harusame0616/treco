"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

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
        <li aria-label={label} key={id}>
          <Button
            className="w-48 font-bold"
            onClick={() => auth.signInWith(id)}
          >
            {label} でログイン
          </Button>
        </li>
      ))}
      <Button
        className="text-primary text-xs"
        onClick={() => auth.signInAnonymously()}
        variant="ghost"
      >
        登録せず開始する
      </Button>
    </ul>
  );
}
