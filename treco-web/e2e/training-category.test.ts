import { expect, test } from '@playwright/test';
import { randomUUID } from 'crypto';

test('トレーニングカテゴリーを作成・編集・編集できる', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'トレーニング記録へのリンク' }).click();

  // トレーニングカテゴリー作成
  await page
    .getByRole('button', { name: 'トレーニングカテゴリーを作成する' })
    .click();
  const oldName = randomUUID();
  const oldColor = '#555555';
  await page.getByRole('textbox', { name: '名前' }).fill(oldName);
  await page.getByLabel('カラー').fill(oldColor);
  await page.getByRole('button', { name: '保存する' }).click();

  // 末尾に追加されていることを確認
  const lastCategoryItem = page
    .getByRole('list', { name: 'カテゴリーリスト' })
    .getByRole('listitem')
    .last();
  await expect(lastCategoryItem).toContainText(oldName);
  // TODO: 色のテスト

  // トレーニングカテゴリー編集
  await lastCategoryItem
    .getByRole('button', { name: 'カテゴリ名編集' })
    .click();
  const newName = randomUUID();
  const newColor = '#333333';
  await page.getByRole('textbox', { name: '名前' }).fill(newName);
  await page.getByLabel('カラー').fill(newColor);
  await page.getByRole('button', { name: '保存する' }).click();

  // 編集されていることを確認
  await expect(lastCategoryItem).toContainText(newName);
  // TODO: 色のテスト

  // TODO: swipe したら削除ボタンが表示されるテスト

  // 削除
  await lastCategoryItem.getByRole('button', { name: '削除' }).click();
  await page
    .getByRole('button', { name: 'トレーニングカテゴリーを削除する' })
    .click();

  await expect(lastCategoryItem).not.toContainText(newName);
});
