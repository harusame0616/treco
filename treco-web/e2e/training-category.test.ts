import { test as base, expect } from '@playwright/test';

import { generateUniqueString } from './lib';
import { TrainingCategoryPage } from './pages/training-category.page';

const test = base.extend<{ trainingCategoryPage: TrainingCategoryPage }>({
  trainingCategoryPage: async ({ page }, use) => {
    const trainingCategoryPage = new TrainingCategoryPage(page);
    await trainingCategoryPage.goTo();
    await use(trainingCategoryPage);
  },
});

test.describe('トレーニングカテゴリーを作成できる', () => {
  test('最小文字数で作成できる', async ({ trainingCategoryPage }) => {
    test.skip(!!process.env.CI, '複数回実行するとエラーが出るためスキップ');

    await trainingCategoryPage.addTrainingCategory({
      categoryName: 'a',
      color: '#000000',
    });

    await expect(
      trainingCategoryPage.getTrainingCategoryItemByName('a'),
    ).toBeVisible();
  });

  test.fixme('最大文字数で作成できる', () => {
    // 最大文字数設定後
  });

  test.fixme('色を指定できる', async () => {
    // スナップショットテストで担保？
  });
});

test.describe('トレーニングカテゴリーを編集できる', () => {
  test('最小文字数で編集できる', async ({ trainingCategoryPage }) => {
    test.skip(!!process.env.CI, '複数回実行するとエラーが出るためスキップ');

    const categoryName = generateUniqueString();
    await trainingCategoryPage.addTrainingCategory({
      categoryName,
      color: '#000000',
    });
    await trainingCategoryPage.editTrainingCategory(categoryName, {
      categoryName: 'b',
      color: '#000000',
    });

    await expect(
      trainingCategoryPage.getTrainingCategoryItemByName('a'),
    ).toBeVisible();
  });

  test.fixme('最大文字数で編集できる', () => {});

  test.fixme('色を指定できる', async () => {
    // スナップショットテストで担保？
  });
});

test('トレーニングカテゴリーを削除できる', async ({ trainingCategoryPage }) => {
  const categoryName = generateUniqueString();
  await trainingCategoryPage.addTrainingCategory({
    categoryName,
    color: '#000000',
  });

  await trainingCategoryPage.removeTrainingCategory(categoryName);

  await expect(
    trainingCategoryPage.getTrainingCategoryItemByName(categoryName),
  ).toHaveCount(0);
});
