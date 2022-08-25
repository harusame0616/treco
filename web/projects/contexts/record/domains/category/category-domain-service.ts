import { ConflictError } from '../../../../custom-error/conflict-error';
import { CategoryRepository } from '../../usecases/category-command-usecase';
import { TrainingEventRepository } from '../../usecases/training-event-command-usecase';
import { TrainingEvent } from '../training-event/training-event';
import { Category } from './category';

export class CategoryDomainService {
  constructor(
    private prop: {
      categoryRepository: CategoryRepository;
      trainingEventRepository: TrainingEventRepository;
    }
  ) {}

  // デフォルトのカテゴリとカテゴリのトレーニング種目を作成する
  async createDefaultCategories(userId: string) {
    const categories = await this.prop.categoryRepository.listCategory({
      userId,
      limit: 1,
    });

    if (categories.length) {
      throw new ConflictError('カテゴリが作成済みです。');
    }

    await Promise.all(
      Category.DEFAULT_CATEGORIES.flatMap(
        ({ trainingEvents, ...categoryDto }) => {
          const category = Category.create({ ...categoryDto, userId });

          return [
            this.prop.categoryRepository.save(category),
            ...trainingEvents.map((trainingEvent) => {
              this.prop.trainingEventRepository.save(
                TrainingEvent.create({ ...category.toDto(), ...trainingEvent })
              );
            }),
          ];
        }
      )
    );
  }
}
