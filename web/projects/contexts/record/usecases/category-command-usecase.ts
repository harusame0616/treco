import { ConflictError } from '../../../custom-error/conflict-error';
import {
  Category,
  CategoryCreateProp,
  CategoryDto,
} from '../domains/category/category';

export interface CategoryRepository {
  findOneByCategoryName(prop: {
    userId: string;
    categoryName: string;
  }): Promise<Category | null>;
  insert(activity: Category): Promise<void>;
}

interface ConstructorProp {
  categoryRepository: CategoryRepository;
}

export class CategoryCommandUsecase {
  constructor(private prop: ConstructorProp) {}

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

    await this.prop.categoryRepository.insert(category);
    return category.toDto();
  }
}
