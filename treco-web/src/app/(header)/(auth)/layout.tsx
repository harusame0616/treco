import { PropsWithChildren } from 'react';

import { MainMenu } from './main-menu';

export default async function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full flex-col">
      <main className="grow overflow-auto">{children}</main>
      <MainMenu currentDate={new Date()} />
    </div>
  );
}
