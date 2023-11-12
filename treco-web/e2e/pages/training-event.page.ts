import { Locator, Page, expect } from '@playwright/test';

export class TrainingEventPage {
  private readonly loadUnitInputBox: Locator;
  private readonly nameInputBox: Locator;
  private readonly valueUnitInputBox: Locator;
  readonly trainingEventItems: Locator;

  constructor(private page: Page) {
    this.trainingEventItems = page
      .getByRole('list', {
        name: 'トレーニング種目リスト',
      })
      .getByRole('listitem');
    this.nameInputBox = page.getByRole('textbox', { name: '名前' });
    this.loadUnitInputBox = page.getByRole('textbox', { name: '負荷の単位' });
    this.valueUnitInputBox = page.getByRole('textbox', { name: '値の単位' });
  }
  async addNewTrainingEvent(trainingEvent: {
    eventName: string;
    loadUnit: string;
    valueUnit: string;
  }) {
    await this.page
      .getByRole('button', { name: 'トレーニング種目を作成する' })
      .click();
    await this.inputTrainingEvent(trainingEvent);
    await this.page.getByRole('button', { name: '保存する' }).click();
  }

  async editTrainingEvent(
    index: number,
    trainingEvent: {
      eventName: string;
      loadUnit: string;
      valueUnit: string;
    },
  ) {
    // １つ目を編集
    await this.trainingEventItems
      .nth(index)
      .getByRole('button', { name: '編集' })
      .click();
    await this.inputTrainingEvent(trainingEvent);

    await expect(
      this.page.getByRole('button', { name: '保存する' }),
    ).toBeEnabled();
    await this.page.getByRole('button', { name: '保存する' }).click();
  }

  async goToNewCategory(categoryName: string) {
    await this.page.goto('/home');
    await this.page
      .getByRole('link', { name: 'トレーニング記録へのリンク' })
      .click();

    await this.page
      .getByRole('button', { name: 'トレーニングカテゴリーを作成する' })
      .click();
    await this.page.getByRole('textbox', { name: '名前' }).fill(categoryName);
    await this.page.getByRole('button', { name: '保存する' }).click();
    await this.page.getByRole('listitem', { name: categoryName }).click();
  }

  async inputTrainingEvent({
    eventName,
    loadUnit,
    valueUnit,
  }: {
    eventName: string;
    loadUnit: string;
    valueUnit: string;
  }) {
    await this.nameInputBox.fill(eventName);
    await this.loadUnitInputBox.fill(loadUnit);
    await this.valueUnitInputBox.fill(valueUnit);
  }

  async removeTrainingEvent(index: number) {
    await this.trainingEventItems
      .nth(index)
      .getByRole('button', { name: '削除' })
      .click();
    await this.page
      .getByRole('button', { name: 'トレーニング種目を削除する' })
      .click();
  }
}
