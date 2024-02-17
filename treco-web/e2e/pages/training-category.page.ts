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
    categoryName: string,
    trainingCategory: {
      categoryName: string;
      color: string;
    },
  ) {
    await this.getTrainingCategoryItemByName(categoryName)
      .getByRole('button', { name: '編集' })
      .click();
    await this.inputTrainingCategory(trainingCategory);
    await this.page.getByRole('button', { name: '保存する' }).click();
  }

  getTrainingCategoryItemByName(categoryName: string) {
    return this.trainingCategoryItems.filter({
      has: this.page.getByText(categoryName, { exact: true }),
    });
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

  async removeTrainingCategory(categoryName: string) {
    await this.trainingCategoryItems
      .filter({
        has: this.page.getByText(categoryName, { exact: true }),
      })
      .getByRole('button', { name: '削除' })
      .click();

    await this.page
      .getByRole('button', { name: 'トレーニングカテゴリーを削除する' })
      .click();
  }
}
