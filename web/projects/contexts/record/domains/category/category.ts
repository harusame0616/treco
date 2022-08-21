import { generateId } from '../../../../utils/id';

export interface CategoryDto {
  userId: string;
  categoryId: string;
  categoryName: string;
  color: string;
}

type ConstructorProp = CategoryDto;
export type CategoryCreateProp = Omit<ConstructorProp, 'categoryId'>;

export class Category {
  private constructor(private prop: ConstructorProp) {}
  static create(prop: CategoryCreateProp) {
    return new Category({ ...prop, categoryId: generateId() });
  }

  toDto(): CategoryDto {
    return { ...this.prop };
  }

  static fromDto(dto: CategoryDto) {
    return new Category(dto);
  }
}
