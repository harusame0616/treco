import { test as setup } from '@playwright/test';

export const defaultUserState = 'playwright/.auth/defaultTrainee.json';
setup('デフォルトユーザーのログインセッション設定', async ({ page }) => {
  page.context().addCookies([
    {
      domain: 'localhost',
      httpOnly: true,
      name: 'next-auth.session-token',
      path: '/',
      sameSite: 'Lax',
      secure: false,
      value: JSON.stringify({
        email: 'auth1@example.com',
        name: '山田花子',
        sub: 'sub1',
      }),
    },
  ]);

  await page.context().storageState({ path: defaultUserState });
});
