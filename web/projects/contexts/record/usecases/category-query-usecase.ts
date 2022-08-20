import { CategoryDto } from '../domains/category/category';

export interface CategoryQuery {
  queryList(userId: string): Promise<CategoryDto[]>;
  queryDetail(userId: string, categoryId: string): Promise<CategoryDto | null>;
}

interface ConstructorProp {
  categoryQuery: CategoryQuery;
}

export class CategoryQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryList(userId: string) {
    if (userId == null) {
      throw new ParameterError();
    }

    return await this.prop.categoryQuery.queryList(userId);
  }

  async queryDetail(userId: string, categoryId: string) {
    return await this.prop.categoryQuery.queryDetail(userId, categoryId);
  }
}
