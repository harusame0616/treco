import { test as setup } from '@playwright/test';

import { authUserFixtures } from '../fixtures/auth-user.fixture';

const defaultTrainee = authUserFixtures[0];

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
        email: defaultTrainee.email,
        sub: defaultTrainee.sub,
      }),
    },
  ]);

  await page.context().storageState({ path: defaultUserState });
});
