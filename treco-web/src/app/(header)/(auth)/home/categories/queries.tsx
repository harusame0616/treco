import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';

const queryByTraineeIdUsecase = new TrainingCategoryQueryByTraineeIdUsecase(
  new PrismaTrainingCategoryQuery(),
);

export async function queryMyCategories() {
  const traineeId = await getSignedInTraineeId();

  return await queryByTraineeIdUsecase.execute({
    traineeId,
  });
}
