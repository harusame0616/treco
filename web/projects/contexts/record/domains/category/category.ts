import { ParameterError } from '../../../../custom-error/parameter-error';
import { generateId, ID_LENGTH } from '../../../../utils/id';

export interface CategoryDto {
  userId: string;
  categoryId: string;
  categoryName: string;
  color: string;
}

type ConstructorProp = CategoryDto;
export type CategoryCreateProp = Omit<ConstructorProp, 'categoryId'>;

export class Category {
  static readonly CATEGORY_NAME_MAX_LENGTH = 20;
  static readonly COLOR_PATTERN = '(^#[0-9a-f]{6}$)|(^#[0-9a-f]{8}$)';

  private constructor(private prop: ConstructorProp) {
    if (!prop) {
      throw new ParameterError(
        'カテゴリ作成パラメーターが指定されていません。'
      );
    }

    [
      [prop.categoryId, 'カテゴリID'],
      [prop.userId, 'ユーザーID'],
    ].forEach(([value, label]) => {
      if (!value?.length) {
        throw new ParameterError(`${label}は必須です。`);
      }
    });

    this.changeCategoryName(prop.categoryName);
    this.changeColor(prop.color);
  }
  static create(prop: CategoryCreateProp) {
    return new Category({ ...prop, categoryId: generateId() });
  }

  toDto(): CategoryDto {
    return { ...this.prop };
  }

  static fromDto(dto: CategoryDto) {
    return new Category(dto);
  }

  get categoryId() {
    return this.prop.categoryId;
  }

  changeCategoryName(newCategoryName: string) {
    if (!newCategoryName?.length) {
      throw new ParameterError('カテゴリ名は必須です。');
    }

    if (typeof newCategoryName !== 'string') {
      throw new ParameterError('カテゴリ名の型が不正です');
    }

    if (newCategoryName.length > Category.CATEGORY_NAME_MAX_LENGTH) {
      throw new ParameterError(
        `カテゴリ名は${Category.CATEGORY_NAME_MAX_LENGTH}以内で入力してください。`
      );
    }

    this.prop.categoryName = newCategoryName;
  }

  changeColor(newColor: string) {
    if (!newColor?.length) {
      throw new ParameterError('カラーは必須です。');
    }

    if (typeof newColor !== 'string') {
      throw new ParameterError('カラーの型が不正です');
    }

    if (!new RegExp(Category.COLOR_PATTERN).test(newColor)) {
      console.log({ newColor });
      throw new ParameterError(`カラーのフォーマットが異常です。`);
    }

    this.prop.color = newColor;
  }
}
