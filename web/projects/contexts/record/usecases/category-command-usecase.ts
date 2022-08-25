import { ConflictError } from '../../../custom-error/conflict-error';
import { NotFoundError } from '../../../custom-error/not-found-error';
import { ParameterError } from '../../../custom-error/parameter-error';
import {
  Category,
  CategoryCreateProp,
  CategoryDto,
} from '../domains/category/category';
import { CategoryDomainService } from '../domains/category/category-domain-service';
import { TrainingEventRepository } from './training-event-command-usecase';

export interface CategoryRepository {
  listCategory(prop: { userId: string; limit?: number }): Promise<Category[]>;
  findOneByCategoryId(prop: {
    userId: string;
    categoryId: string;
  }): Promise<Category | null>;
  findOneByCategoryName(prop: {
    userId: string;
    categoryName: string;
  }): Promise<Category | null>;
  save(category: Category): Promise<void>;
}

interface ConstructorProp {
  categoryRepository: CategoryRepository;
  trainingEventRepository: TrainingEventRepository;
}

export class CategoryCommandUsecase {
  private categoryDomainService: CategoryDomainService;
  constructor(private prop: ConstructorProp) {
    this.categoryDomainService = new CategoryDomainService(prop);
  }

  async createNewCategory(prop: CategoryCreateProp): Promise<CategoryDto> {
    const registeredCategory =
      await this.prop.categoryRepository.findOneByCategoryName({
        userId: prop.userId,
        categoryName: prop.categoryName,
      });
    if (registeredCategory) {
      throw new ConflictError('同じ名前のカテゴリが存在します。', { prop });
    }

    const category = Category.create(prop);

    await this.prop.categoryRepository.save(category);
    return category.toDto();
  }

  async editCategory(prop: CategoryDto): Promise<CategoryDto> {
    if (!prop.categoryId || !prop.categoryName || !prop.color || !prop.userId) {
      throw new ParameterError('パラメーターが不足しています。', prop);
    }

    const [sameNameCategory, registeredCategory] = await Promise.all([
      this.prop.categoryRepository.findOneByCategoryName(prop),
      this.prop.categoryRepository.findOneByCategoryId(prop),
    ]);

    if (!registeredCategory) {
      throw new NotFoundError('カテゴリが見つかりませんでした。');
    }

    if (
      sameNameCategory &&
      sameNameCategory.categoryId !== registeredCategory.categoryId
    ) {
      throw new ConflictError('同じ名前のカテゴリが存在します。', { prop });
    }

    registeredCategory.changeCategoryName(prop.categoryName);
    registeredCategory.changeColor(prop.color);

    await this.prop.categoryRepository.save(registeredCategory);
    return registeredCategory.toDto();
  }

  async createDefaultCategories(userId: string): Promise<void> {
    await this.categoryDomainService.createDefaultCategories(userId);
  }
}
