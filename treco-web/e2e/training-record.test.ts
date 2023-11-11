import { expect, test } from '@playwright/test';

test('トレーニングセットを記録できる', async ({ page }) => {
  // トレーニング記録ページへ移動
  await page.goto('/home');
  await page.getByRole('link', { name: 'トレーニング記録へのリンク' }).click();
  await page.getByRole('link', { name: '胸' }).click();
  await page.getByRole('button', { name: 'ベンチプレス' }).click();

  // １セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('24.52');
  await page.getByRole('spinbutton', { name: '値' }).fill('10');
  await page.getByRole('button', { name: '追加する' }).click();

  // ２セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('26.32');
  await page.getByRole('spinbutton', { name: '値' }).fill('22');
  await page.getByRole('textbox', { name: '備考' }).fill('追い込み');
  await page.getByRole('button', { name: '追加する' }).click();

  // 1セット目が記録されていることを確認
  const firstSet = page
    .getByRole('list', { name: 'トレーニングセット' })
    .getByRole('listitem')
    .first();
  await expect(firstSet).toContainText('24.52');
  await expect(firstSet).toContainText('10');
  // 備考は未入力の場合はハイフンが表示される
  await expect(firstSet).toContainText('-');

  // 降順で２セット目が記録されていることを確認
  const lastSet = page
    .getByRole('list', { name: 'トレーニングセット' })
    .getByRole('listitem')
    .last();
  await expect(lastSet).toContainText('26.32');
  await expect(lastSet).toContainText('22');
  await expect(lastSet).toContainText('追い込み');
});

test('トレニーニングセットを編集できる', async ({ page }) => {
  // トレーニング記録ページへ移動
  await page.goto('/home');
  await page.getByRole('link', { name: 'トレーニング記録へのリンク' }).click();
  await page.getByRole('link', { name: '胸' }).click();
  await page.getByRole('button', { name: 'ベンチプレス' }).click();

  // １セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('24.52');
  await page.getByRole('spinbutton', { name: '値' }).fill('10');
  await page.getByRole('button', { name: '追加する' }).click();

  // ２セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('26.32');
  await page.getByRole('spinbutton', { name: '値' }).fill('22');
  await page.getByRole('textbox', { name: '備考' }).fill('追い込み');
  await expect(page.getByRole('button', { name: '追加する' })).toBeEnabled();
  await page.getByRole('button', { name: '追加する' }).click();
  await expect(page.getByRole('button', { name: '追加する' })).toBeEnabled();

  // １セット目を選択する
  const firstSet = page
    .getByRole('list', { name: 'トレーニングセット' })
    .getByRole('listitem')
    .first();
  await firstSet.getByRole('button', { name: '編集' }).click();

  // フォームに値が反映されていることを確認する
  await expect(page.getByRole('spinbutton', { name: '負荷' })).toHaveValue(
    '24.52',
  );
  await expect(page.getByRole('spinbutton', { name: '値' })).toHaveValue('10');
  await expect(page.getByRole('textbox', { name: '備考' })).toHaveValue('');

  // １セット目を変更する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('30.12');
  await page.getByRole('spinbutton', { name: '値' }).fill('20');
  await page.getByRole('textbox', { name: '備考' }).fill('変更');
  await page.getByRole('button', { name: '変更する' }).click();

  // 1セット目が変更されていることを確認する
  await expect(firstSet).toContainText('30.12');
  await expect(firstSet).toContainText('20');
  await expect(firstSet).toContainText('変更');
});

test('トレーニングセットを削除できる', async ({ page }) => {
  // トレーニング記録ページへ移動
  await page.goto('/home');
  await page.getByRole('link', { name: 'トレーニング記録へのリンク' }).click();
  await page.getByRole('link', { name: '胸' }).click();
  await page.getByRole('button', { name: 'ベンチプレス' }).click();

  // １セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('24.52');
  await page.getByRole('spinbutton', { name: '値' }).fill('10');
  await page.getByRole('button', { name: '追加する' }).click();

  // ２セット目を記録する
  await page.getByRole('spinbutton', { name: '負荷' }).fill('26.32');
  await page.getByRole('spinbutton', { name: '値' }).fill('22');
  await page.getByRole('textbox', { name: '備考' }).fill('追い込み');
  await expect(page.getByRole('button', { name: '追加する' })).toBeEnabled();
  await page.getByRole('button', { name: '追加する' }).click();
  await expect(page.getByRole('button', { name: '追加する' })).toBeEnabled();

  // 削除ボタンをクリックする
  const firstSet = page
    .getByRole('list', { name: 'トレーニングセット' })
    .getByRole('listitem')
    .first();
  await firstSet.getByRole('button', { name: '削除' }).click();
  await page
    .getByRole('button', { name: 'トレーニングセットを削除する' })
    .click();

  await expect(firstSet).toContainText('26.32');
  await expect(firstSet).toContainText('22');
  await expect(firstSet).toContainText('追い込み');
});
