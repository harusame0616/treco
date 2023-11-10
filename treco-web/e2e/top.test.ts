import { expect, test } from '@playwright/test';

test.describe('トップページ', () => {
  const path = '/';

  test('未ログインだとトップページを表示する', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(path);

    await expect(page).toHaveURL(path);
  });

  test('ログイン済みだとホーム画面にリダイレクトする', async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL('/home');
  });
});
