import { expect, test } from '@playwright/test';
import { randomUUID } from 'crypto';

test('トレーニング種目を作成・編集・編集できる', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'トレーニング記録へのリンク' }).click();

  // トレーニングカテゴリー作成
  await page
    .getByRole('button', { name: 'トレーニングカテゴリーを作成する' })
    .click();
  const categoryName = randomUUID();
  await page.getByRole('textbox', { name: '名前' }).fill(categoryName);
  await page.getByRole('button', { name: '保存する' }).click();
  await page.getByRole('listitem', { name: categoryName }).click();

  // トレーニング種目1つ目作成
  await page
    .getByRole('button', { name: 'トレーニング種目を作成する' })
    .click();
  const event1 = {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  };
  await page.getByRole('textbox', { name: '名前' }).fill(event1.eventName);
  await page.getByRole('textbox', { name: '負荷の単位' }).fill(event1.loadUnit);
  await page.getByRole('textbox', { name: '値の単位' }).fill(event1.valueUnit);
  await page.getByRole('button', { name: '保存する' }).click();

  // ２つ目作成
  await page
    .getByRole('button', { name: 'トレーニング種目を作成する' })
    .click();
  const event2 = {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  };
  await page.getByRole('textbox', { name: '名前' }).fill(event2.eventName);
  await page.getByRole('textbox', { name: '負荷の単位' }).fill(event2.loadUnit);
  await page.getByRole('textbox', { name: '値の単位' }).fill(event2.valueUnit);
  await page.getByRole('button', { name: '保存する' }).click();

  // 作成順に表示されていることを確認
  const eventListItems = await page
    .getByRole('list', {
      name: `${categoryName}のトレーニング種目リスト`,
    })
    .getByRole('listitem');
  await expect(eventListItems).toHaveCount(2);
  await expect(eventListItems.first()).toContainText(event1.eventName);
  await expect(eventListItems.last()).toContainText(event2.eventName);

  // １つ目を編集
  await eventListItems.first().getByRole('button', { name: '編集' }).click();
  const event1edit = {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  };
  await page.getByRole('textbox', { name: '名前' }).fill(event1edit.eventName);
  await page
    .getByRole('textbox', { name: '負荷の単位' })
    .fill(event1edit.loadUnit);
  await page
    .getByRole('textbox', { name: '値の単位' })
    .fill(event1edit.valueUnit);
  await page.getByRole('button', { name: '保存する' }).click();

  // 編集されていることを確認
  await expect(eventListItems.first()).toContainText(event1edit.eventName);

  await eventListItems.first().getByRole('button', { name: '削除' }).click();
  await page
    .getByRole('button', { name: 'トレーニング種目を削除する' })
    .click();

  await expect(eventListItems.first()).not.toContainText(event1edit.eventName);
});
