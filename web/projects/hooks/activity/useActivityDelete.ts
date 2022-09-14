import { ActivityFullId } from '@Domains/activity/activity';
import { FSActivityRepository } from '@Repositories/fs-activity-repository';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { ActivityCommandUsecase } from '@Usecases/activity-command-usecase';

const activityCommandUsecase = new ActivityCommandUsecase({
  activityRepository: new FSActivityRepository(),
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

const useActivityDelete = () => {
  return {
    deleteActivity: async (prop: ActivityFullId) => {
      await activityCommandUsecase.deleteActivity(prop);
    },
  };
};

export default useActivityDelete;
