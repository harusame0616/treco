/**
 * @jest-environment node
 */

import { Activity } from '@Domains/activity/activity';
import { generateId } from '@/utils/id';
import { ParameterError } from '@/custom-error/parameter-error';

describe('正常系', () => {
  const userId = 'a'.repeat(28);
  const categoryId = generateId();
  const trainingEventId = generateId();
  const date = new Date();

  test('toDto', () => {
    const activity = Activity.create({
      userId,
      categoryId,
      trainingEventId,
      date,
    });
    const records = [
      {
        load: 10,
        value: 1,
        note: '',
      },
      {
        load: 30,
        value: 1,
        note: '',
      },
    ];
    activity.updateRecords(records);

    expect(activity.toDto()).toEqual({
      userId,
      categoryId,
      trainingEventId,
      activityId: expect.any(String),
      date,
      records,
    });
  });
});

describe('異常系', () => {
  const userId = 'a'.repeat(28);
  const categoryId = generateId();
  const trainingEventId = generateId();
  const date = new Date();

  describe('create', () => {
    test.each(['userId', 'categoryId', 'trainingEventId'])(
      '各種IDのフォーマットが不正',
      (idName) => {
        const prop = {
          userId,
          categoryId,
          trainingEventId,
          date,
        };

        expect(() =>
          Activity.create({ ...prop, [idName]: 'invalid' })
        ).toThrow();
      }
    );

    test('日付が不正', () => {
      expect(() =>
        Activity.create({
          userId,
          categoryId,
          trainingEventId,
          date: new Date('invalid'),
        })
      ).toThrow(new ParameterError('日付が不正です。'));
    });
  });

  describe('updateRecords', () => {
    test.each([0, 31])('レコード数が異常', (recordCount) => {
      const prop = {
        userId,
        categoryId,
        trainingEventId,
        date,
      };

      const activity = Activity.create(prop);

      expect(() =>
        activity.updateRecords(
          new Array(recordCount)
            .fill(0)
            .map(() => ({ load: 0, value: 0, note: '' }))
        )
      ).toThrow();
    });

    test('備考文字数オーバー', () => {
      const prop = {
        userId,
        categoryId,
        trainingEventId,
        date,
      };

      const activity = Activity.create(prop);

      expect(() =>
        activity.updateRecords([{ load: 0, value: 0, note: 'a'.repeat(1025) }])
      ).toThrow();
    });
  });
});
