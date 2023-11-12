import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import { TrainingEventPage } from './pages/training-event.page';

const events = [
  {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  },
  {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  },
];

const test = base.extend<{
  trainingEventPage: TrainingEventPage;
}>({
  trainingEventPage: async ({ page }, use) => {
    const trainingEventPage = new TrainingEventPage(page);

    const categoryName = randomUUID();
    await trainingEventPage.goToInNewCategories(categoryName);

    await trainingEventPage.addNewTrainingEvent(events[0]);
    await trainingEventPage.addNewTrainingEvent(events[1]);

    await use(trainingEventPage);
  },
});

test('トレーニング種目が作成順に表示する', async ({ trainingEventPage }) => {
  // 作成順に表示されていることを確認
  await expect(trainingEventPage.trainingEventItems).toHaveCount(2);
  await expect(trainingEventPage.trainingEventItems.nth(0)).toContainText(
    events[0].eventName,
  );
  await expect(trainingEventPage.trainingEventItems.nth(1)).toContainText(
    events[1].eventName,
  );
  // TODO: 単位の確認
});

test('トレーニング種目を編集できる', async ({ trainingEventPage }) => {
  const editEvent = {
    eventName: randomUUID(),
    loadUnit: randomUUID(),
    valueUnit: randomUUID(),
  };
  await trainingEventPage.editTrainingEvent(0, editEvent);

  // 編集されていることを確認
  await expect(trainingEventPage.trainingEventItems.nth(0)).toContainText(
    editEvent.eventName,
  );
});

test('トレーニング種目を削除できる', async ({ trainingEventPage }) => {
  await trainingEventPage.removeTrainingEvent(0);

  await expect(trainingEventPage.trainingEventItems).toHaveCount(1);
  await expect(trainingEventPage.trainingEventItems.nth(0)).toContainText(
    events[1].eventName,
  );
});
