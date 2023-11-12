import { test as base, expect } from '@playwright/test';

import { TrainingCategoryPage } from './pages/training-category.page';

const categories = [
  {
    categoryName: 'カテゴリー1',
    color: '#111111',
  },
  {
    categoryName: 'カテゴリー2',
    color: '#222222',
  },
  {
    categoryName: 'カテゴリー3',
    color: '#333333',
  },
] as const;

const test = base.extend<{ trainingCategoryPage: TrainingCategoryPage }>({
  trainingCategoryPage: async ({ page }, use) => {
    const trainingCategoryPage = new TrainingCategoryPage(page);
    // カテゴリを作成
    trainingCategoryPage.goTo();

    for (const category of categories) {
      await trainingCategoryPage.addTrainingCategory(category);
    }

    await use(trainingCategoryPage);
  },
});

test('トレーニングカテゴリーが最後に追加されている', async ({
  trainingCategoryPage,
}) => {
  await expect(
    trainingCategoryPage.trainingCategoryItems.nth(-3),
  ).toContainText(categories.at(-3)!.categoryName);
  await expect(
    trainingCategoryPage.trainingCategoryItems.nth(-2),
  ).toContainText(categories.at(-2)!.categoryName);
  await expect(
    trainingCategoryPage.trainingCategoryItems.nth(-1),
  ).toContainText(categories.at(-1)!.categoryName);

  // TODO: 色のテスト
});

test('トレーニングカテゴリーを編集できる', async ({ trainingCategoryPage }) => {
  const editCategory = {
    categoryName: '編集済みカテゴリー',
    color: '#444444',
  };
  await trainingCategoryPage.editTrainingCategory(0, editCategory);

  // 編集されていることを確認
  await expect(trainingCategoryPage.trainingCategoryItems.nth(0)).toContainText(
    editCategory.categoryName,
  );

  // TODO: 色のテスト
});

test('トレーニングカテゴリーを削除できる', async ({ trainingCategoryPage }) => {
  await trainingCategoryPage.removeTrainingCategory(-2);
  await expect(
    trainingCategoryPage.trainingCategoryItems.nth(-2),
  ).not.toContainText(categories.at(1)!.categoryName);
});
