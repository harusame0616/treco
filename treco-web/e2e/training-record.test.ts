import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

import { TrainingRecordPage } from './pages/training-record.page';

const sets = [
  {
    load: 24.52,
    note: '',
    value: 10,
  },
  {
    load: 20.52,
    note: '',
    value: 20,
  },
  {
    load: 24,
    note: '',
    value: 30,
  },
  {
    load: 25.0,
    note: '',
    value: 40,
  },
];

const test = base.extend<{ trainingRecordPage: TrainingRecordPage }>({
  trainingRecordPage: async ({ page }, use) => {
    const trainingRecordPage = new TrainingRecordPage(page);
    const categoryName = randomUUID();
    const eventName = randomUUID();
    await trainingRecordPage.goToNewCategoryEvent(categoryName, eventName);

    for (const set of sets) {
      await trainingRecordPage.addTrainingSet(set);
    }

    use(trainingRecordPage);
  },
});

test('トレーニングセットが追加順に表示される', async ({
  trainingRecordPage,
}) => {
  await Promise.all(
    sets.map(async (set, index) => {
      const setItem = trainingRecordPage.trainingSetItems.nth(index);
      await expect(setItem).toContainText(`${set.load}`);
      await expect(setItem).toContainText(`${set.value}`);
      await expect(setItem).toContainText(set.note || '-');
    }),
  );
});

test('トレニーニングセットを編集できる', async ({ trainingRecordPage }) => {
  const editSet = {
    load: 555,
    note: 'before',
    value: 444,
  };
  await trainingRecordPage.editTrainingSet(0, editSet);
  await expect(trainingRecordPage.trainingSetItems.nth(0)).toContainText(
    `${editSet.load}`,
  );
  await expect(trainingRecordPage.trainingSetItems.nth(0)).toContainText(
    `${editSet.value}`,
  );
  await expect(trainingRecordPage.trainingSetItems.nth(0)).toContainText(
    editSet.note,
  );
});

test('トレーニングセットを削除できる', async ({ trainingRecordPage }) => {
  // トレーニングセット登録中に削除すると挙動がおかしくなるため toHaveCount で登録が完了するのをまつ
  // TODO: toHaveCount を使わない方法を探す
  await expect(trainingRecordPage.trainingSetItems).toHaveCount(4);

  await trainingRecordPage.removeTrainingSet(1);
  await expect(trainingRecordPage.trainingSetItems.nth(1)).not.toContainText(
    `${sets[1].load}`,
  );
});
