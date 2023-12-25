import { Locator, Page } from '@playwright/test';

export class TrainingCategoryPage {
  readonly trainingCategoryItems: Locator;

  constructor(private page: Page) {
    this.trainingCategoryItems = page
      .getByRole('list', {
        name: 'トレーニングカテゴリー',
      })
      .getByRole('listitem');
  }

  async addTrainingCategory(trainingCategory: {
    categoryName: string;
    color: string;
  }) {
    await this.page
      .getByRole('button', { name: 'トレーニングカテゴリーを作成する' })
      .click();
    await this.inputTrainingCategory(trainingCategory);
    await this.page.getByRole('button', { name: '保存する' }).click();
  }

  async editTrainingCategory(
    index: number,
    trainingCategory: {
      categoryName: string;
      color: string;
    },
  ) {
    await this.trainingCategoryItems
      .nth(index)
      .getByRole('button', { name: '編集' })
      .click();
    await this.inputTrainingCategory(trainingCategory);
    await this.page.getByRole('button', { name: '保存する' }).click();
  }

  async goTo() {
    await this.page.goto('/home');
    await this.page.getByRole('link', { name: 'トレーニング記録' }).click();
  }

  async inputTrainingCategory({
    categoryName,
    color,
  }: {
    categoryName: string;
    color: string;
  }) {
    await this.page.getByRole('textbox', { name: '名前' }).fill(categoryName);
    await this.page.getByLabel('カラー').fill(color);
  }

  async removeTrainingCategory(index: number) {
    await this.trainingCategoryItems
      .nth(index)
      .getByRole('button', { name: '削除' })
      .click();
    await this.page
      .getByRole('button', { name: 'トレーニングカテゴリーを削除する' })
      .click();
  }
}
