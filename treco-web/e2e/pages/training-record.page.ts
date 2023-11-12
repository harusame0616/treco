import { Locator, Page } from '@playwright/test';

export class TrainingRecordPage {
  readonly trainingSetItems: Locator;

  constructor(private page: Page) {
    this.trainingSetItems = page
      .getByRole('list', {
        name: 'トレーニングセット',
      })
      .getByRole('listitem');
  }

  async addTrainingSet(trainingSet: {
    load: number;
    note?: string;
    value: number;
  }) {
    await this.inputTrainingSet(trainingSet);
    await this.page.getByRole('button', { name: '追加する' }).click();
  }

  async editTrainingSet(
    index: number,
    trainingSet: {
      load: number;
      note?: string;
      value: number;
    },
  ) {
    await this.trainingSetItems
      .nth(index)
      .getByRole('button', { name: '編集' })
      .click();

    // 対象のセットの値が入力フォームに反映する前に入力してしまうため時間を置く
    // TODO: waitForTimeout を使わない方法を探す
    await this.page.waitForTimeout(500);
    await this.inputTrainingSet(trainingSet);
    await this.page.getByRole('button', { name: '変更する' }).click();
  }

  async goToNewCategoryEvent(categoryName: string, eventName: string) {
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

    await this.page
      .getByRole('button', { name: 'トレーニング種目を作成する' })
      .click();
    await this.page.getByRole('textbox', { name: '名前' }).fill(eventName);
    await this.page.getByRole('button', { name: '保存する' }).click();
    await this.page.getByRole('listitem', { name: eventName }).click();
  }

  async inputTrainingSet({
    load,
    note = '',
    value,
  }: {
    load: number;
    note?: string;
    value: number;
  }) {
    await this.page.getByRole('spinbutton', { name: '負荷' }).fill(`${load}`);
    await this.page.getByRole('spinbutton', { name: '値' }).fill(`${value}`);
    await this.page.getByRole('textbox', { name: '備考' }).fill(note);
  }

  async removeTrainingSet(index: number) {
    await this.trainingSetItems
      .nth(index)
      .getByRole('button', { name: '削除' })
      .click();
    await this.page
      .getByRole('button', { name: 'トレーニングセットを削除する' })
      .click();
  }
}
