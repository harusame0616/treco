interface ConstructorProp {
  categoryId: string;
  categoryName: string;
  color: string;
}

export interface CategoryDto {
  categoryId: string;
  categoryName: string;
  color: string;
}

export class Category {
  constructor(private prop: ConstructorProp) {}
}
