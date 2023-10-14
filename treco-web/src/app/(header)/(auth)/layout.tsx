import { isAuthenticated } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { MainMenu } from "./main-menu";

type Props = {
  searchParams: {
    selectedDate?: string;
  };
};

export default async function AuthLayout({
  children,
}: PropsWithChildren<Props>) {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-full">
      <main className="overflow-scroll grow">{children}</main>
      <MainMenu />
    </div>
  );
}
