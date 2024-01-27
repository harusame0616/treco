import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import { TrainingEventPage } from './pages/training-event.page';

const events = [
  {
    eventName: '種目1',
    loadUnit: 'kg1',
    valueUnit: '回1',
  },
  {
    eventName: '種目2',
    loadUnit: 'kg2',
    valueUnit: '回2',
  },
  {
    eventName: '種目3',
    loadUnit: 'kg3',
    valueUnit: '回3',
  },
  {
    eventName: '種目4',
    loadUnit: 'kg4',
    valueUnit: '回4',
  },
  {
    eventName: '種目5',
    loadUnit: 'kg5',
    valueUnit: '回5',
  },
  {
    eventName: '種目6',
    loadUnit: 'kg6',
    valueUnit: '回6',
  },
];

base.describe('カテゴリ未作成状態', () => {
  const test = base.extend<{
    trainingEventPage: TrainingEventPage;
  }>({
    trainingEventPage: async ({ page }, use) => {
      const trainingEventPage = new TrainingEventPage(page);

      await use(trainingEventPage);
    },
  });

  test('トレーニングカテゴリー名が表示される', async ({
    trainingEventPage,
  }) => {
    // カテゴリを作成
    const categoryName = randomUUID();
    await trainingEventPage.goToNewCategory(categoryName);

    await expect(trainingEventPage.categoryNameGroup).toContainText(
      categoryName,
    );
  });
});

base.describe('トレーニング種目作成済み状態', () => {
  const test = base.extend<{
    trainingEventPage: TrainingEventPage;
  }>({
    trainingEventPage: async ({ page }, use) => {
      const trainingEventPage = new TrainingEventPage(page);
      // カテゴリを作成
      const categoryName = randomUUID();
      await trainingEventPage.goToNewCategory(categoryName);

      // トレーニング種目を作成
      for (const event of events) {
        await trainingEventPage.addNewTrainingEvent(event);
      }

      await use(trainingEventPage);
    },
  });

  test('トレーニング種目が作成順に表示される', async ({
    trainingEventPage,
  }) => {
    expect(trainingEventPage.trainingEventItems).toHaveCount(events.length);

    // 作成順に表示されていることを確認
    await Promise.all(
      events.map((event, index) =>
        expect(trainingEventPage.trainingEventItems.nth(index)).toContainText(
          event.eventName,
        ),
      ),
    );

    // TODO: 単位の確認
  });

  test('トレーニング種目を編集できる', async ({ trainingEventPage }) => {
    const editEvent = {
      eventName: '編集済み種目',
      loadUnit: 'kg編集済み',
      valueUnit: '回編集済み',
    };
    await trainingEventPage.editTrainingEvent(0, editEvent);

    // 編集されていることを確認
    await expect(trainingEventPage.trainingEventItems.nth(0)).toContainText(
      editEvent.eventName,
    );

    // TODO: 単位の確認
  });

  test('トレーニング種目を削除できる', async ({ trainingEventPage }) => {
    await trainingEventPage.removeTrainingEvent(1);

    await expect(trainingEventPage.trainingEventItems).toHaveCount(
      events.length - 1,
    );
    await expect(trainingEventPage.trainingEventItems.nth(1)).toContainText(
      events[2].eventName,
    );
  });
});
