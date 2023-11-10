import { test as setup } from '@playwright/test';

import { authUserFixtures } from '../fixtures/auth-user.fixture';
import { traineeFixtures } from '../fixtures/trainee.fixture';

const defaultAuthUser = authUserFixtures[0];
const defaultTrainee = traineeFixtures[0];

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
        email: defaultAuthUser.email,
        name: defaultTrainee.name,
        sub: defaultAuthUser.sub,
      }),
    },
  ]);

  await page
    .context()
    .storageState({ path: 'playwright/.auth/defaultTrainee.json' });
});
