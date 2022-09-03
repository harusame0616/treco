/**
 * @jest-environment node
 */

import { generateId } from '@/utils/id';
import { Activity } from '@Domains/activity/activity';
import { NotFoundError } from '@Errors/not-found-error';
import { ParameterError } from '@Errors/parameter-error';
import { FSActivityRepository } from '@Repositories/fs-activity-repository';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { ActivityCommandUsecase } from '@Usecases/activity-command-usecase';
jest.mock('@Repositories/fs-activity-repository');
jest.mock('@Repositories/fs-category-repository');
jest.mock('@Repositories/fs-training-event-repository');
jest.mock('@Domains/activity/activity');

describe('正常系', () => {
  test('createNewActivity', async () => {
    const activityRepository = new FSActivityRepository();
    const categoryRepository = new FSCategoryRepository();
    const trainingEventRepository = new FSTrainigEventRepository();

    (categoryRepository.findOneByCategoryId as jest.Mock).mockImplementation(
      () => ({})
    );
    (
      trainingEventRepository.findOneByTrainingEventId as jest.Mock
    ).mockImplementation(() => ({}));
    (Activity.create as jest.Mock).mockImplementation(() => ({
      toDto: jest.fn(),
    }));

    const activityCommandUsecase = new ActivityCommandUsecase({
      activityRepository,
      categoryRepository,
      trainingEventRepository,
    });

    const prop = {
      date: new Date(),
      userId: 'a'.repeat(28),
      categoryId: generateId(),
      trainingEventId: generateId(),
    };
    await activityCommandUsecase.createNewActivity(prop);

    expect((Activity.create as jest.Mock).mock.calls[0][0]).toEqual(prop);
    // Activity.createはモックしてしまっていて、
    // 返却値が変わってしまっているので呼ばれているかどうかのみ確認
    expect(
      (activityRepository.insert as jest.Mock).mock.calls.length
    ).toBeTruthy();
  });

  test('updateRecords', async () => {
    const activityRepository = new FSActivityRepository();
    const categoryRepository = new FSCategoryRepository();
    const trainingEventRepository = new FSTrainigEventRepository();

    const updateRecordFn = jest.fn();
    (activityRepository.findOne as jest.Mock).mockImplementation(() => ({
      updateRecords: updateRecordFn,
      toDto: jest.fn(),
    }));

    const activityCommandUsecase = new ActivityCommandUsecase({
      activityRepository,
      categoryRepository,
      trainingEventRepository,
    });

    const records = [
      {
        value: 1,
        load: 1,
        note: '',
      },
    ];
    await activityCommandUsecase.updateActivityRecord({
      userId: 'a'.repeat(28),
      categoryId: generateId(),
      trainingEventId: generateId(),
      activityId: generateId(),
      records,
    });

    expect(updateRecordFn.mock.calls[0][0]).toEqual(records);
    expect((activityRepository.save as jest.Mock).mock.calls.length).toBe(1);
  });

  describe('deleteActivity', () => {
    const categoryRepository = new FSCategoryRepository();
    const trainingEventRepository = new FSTrainigEventRepository();

    test('存在しないアクティビティを指定', async () => {
      const activityRepository = new FSActivityRepository();

      const activityCommandUsecase = new ActivityCommandUsecase({
        activityRepository,
        categoryRepository,
        trainingEventRepository,
      });

      await activityCommandUsecase.deleteActivity({
        activityId: generateId(),
        trainingEventId: generateId(),
        categoryId: generateId(),
        userId: 'a'.repeat(28),
      });
      expect(
        (activityRepository.delete as jest.Mock).mock.calls[0]
      ).toBeFalsy();
    });

    test('存在するアクティビティを指定', async () => {
      const activityRepository = new FSActivityRepository();
      (activityRepository.findOne as jest.Mock).mockImplementation(() => ({}));

      const activityCommandUsecase = new ActivityCommandUsecase({
        activityRepository,
        categoryRepository,
        trainingEventRepository,
      });

      await activityCommandUsecase.deleteActivity({
        activityId: generateId(),
        trainingEventId: generateId(),
        categoryId: generateId(),
        userId: 'a'.repeat(28),
      });

      expect(
        (activityRepository.delete as jest.Mock).mock.calls[0][0]
      ).toBeTruthy();
    });
  });
});

describe('異常系', () => {
  describe('createNewActivity', () => {
    test('存在しないカテゴリを指定', async () => {
      const activityRepository = new FSActivityRepository();
      const categoryRepository = new FSCategoryRepository();
      const trainingEventRepository = new FSTrainigEventRepository();

      const activityCommandUsecase = new ActivityCommandUsecase({
        activityRepository,
        categoryRepository,
        trainingEventRepository,
      });

      expect(() =>
        activityCommandUsecase.createNewActivity({
          userId: generateId(),
          categoryId: generateId(),
          trainingEventId: generateId(),
          date: new Date(),
        })
      ).rejects.toThrow(new NotFoundError('カテゴリが見つかりません。'));
    });

    test('存在しないトレーニング種目を指定', async () => {
      const activityRepository = new FSActivityRepository();
      const categoryRepository = new FSCategoryRepository();
      const trainingEventRepository = new FSTrainigEventRepository();

      (categoryRepository.findOneByCategoryId as jest.Mock).mockImplementation(
        () => ({})
      );

      const activityCommandUsecase = new ActivityCommandUsecase({
        activityRepository,
        categoryRepository,
        trainingEventRepository,
      });

      expect(() =>
        activityCommandUsecase.createNewActivity({
          userId: 'a'.repeat(28),
          categoryId: generateId(),
          trainingEventId: generateId(),
          date: new Date(),
        })
      ).rejects.toThrow(
        new ParameterError('トレーニング種目が見つかりません。')
      );
    });
  });
});
