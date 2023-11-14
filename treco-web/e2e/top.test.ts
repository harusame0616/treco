import { expect, test } from '@playwright/test';

const path = '/';

test.describe('未ログイン', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('[SS]トップページを表示する', async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(path);
    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
});

test('ログイン済みだとホーム画面にリダイレクトする', async ({ page }) => {
  await page.goto(path);

  await expect(page).toHaveURL('/home');
});
