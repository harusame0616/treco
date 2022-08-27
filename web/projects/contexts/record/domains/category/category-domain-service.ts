import { ConflictError } from '../../../../custom-error/conflict-error';
import { CategoryRepository } from '../../usecases/category-command-usecase';
import { TrainingEventRepository } from '../../usecases/training-event-command-usecase';
import { TrainingEvent } from '../training-event/training-event';
import { Category, CategoryCreateProp } from './category';

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
        ({ trainingEvents, ...categoryDto }, order) => {
          const category = Category.create({ ...categoryDto, userId, order });

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

  async createNewCategory(
    prop: Omit<CategoryCreateProp, 'order'>
  ): Promise<Category> {
    const lastOrderCategory =
      await this.prop.categoryRepository.findOneByLastOrder({
        userId: prop.userId,
      });

    return Category.create({
      ...prop,
      order: (lastOrderCategory?.order ?? -1) + 1,
    });
  }
}
