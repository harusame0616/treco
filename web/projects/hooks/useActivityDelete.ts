import { ActivityFullId } from '../contexts/record/domains/activity/activity';
import { FSActivityRepository } from '../contexts/record/infrastructure/repository/fs-activity-repository';
import { ActivityCommandUsecase } from '../contexts/record/usecases/activity-command-usecase';

const activityCommandUsecase = new ActivityCommandUsecase({
  activityRepository: new FSActivityRepository(),
});

const useActivityDelete = () => {
  return {
    deleteActivity: async (prop: ActivityFullId) => {
      await activityCommandUsecase.deleteActivity(prop);
    },
  };
};

export default useActivityDelete;
