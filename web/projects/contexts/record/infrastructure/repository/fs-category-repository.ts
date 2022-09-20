import {
  deleteDoc,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Category, CategoryDto } from '../../domains/category/category';
import { CategoryRepository } from '../../usecases/category-command-usecase';
import {
  fsCategoryCollection,
  fsCategoryDoc,
  getDocManagedCache,
  getDocsManagedCache,
} from '../firestore-utils';

export class FSCategoryRepository implements CategoryRepository {
  async save(category: Category) {
    const dto = category.toDto();

    await setDoc(fsCategoryDoc(dto), dto);
  }

  async listCategory(prop: {
    userId: string;
    limit?: number;
  }): Promise<Category[]> {
    const collectionRef = fsCategoryCollection(prop);

    let categories = await getDocsManagedCache(
      prop.limit == null
        ? collectionRef
        : query(collectionRef, limit(prop.limit))
    );
    return categories.docs.map((doc) =>
      Category.fromDto(doc.data() as CategoryDto)
    );
  }

  async findOneByCategoryId(prop: {
    userId: string;
    categoryId: string;
  }): Promise<Category | null> {
    let categoryDto = await getDocManagedCache(fsCategoryDoc(prop));

    return categoryDto.exists()
      ? Category.fromDto(categoryDto.data() as any)
      : null;
  }

  async findOneByCategoryName(prop: {
    userId: string;
    categoryName: string;
  }): Promise<Category | null> {
    const categories = await getDocsManagedCache(
      query(
        fsCategoryCollection(prop),
        where('categoryName', '==', prop.categoryName),
        limit(1)
      )
    );

    return categories.empty
      ? null
      : Category.fromDto(categories.docs[0].data() as any);
  }

  async findOneByLastOrder(prop: { userId: string }): Promise<Category | null> {
    const categoryDtoList = await getDocsManagedCache(
      query(fsCategoryCollection(prop), orderBy('order', 'desc'), limit(1))
    );

    return categoryDtoList.empty
      ? null
      : Category.fromDto(categoryDtoList.docs[0].data() as any);
  }

  async delete(category: Category): Promise<void> {
    return await deleteDoc(fsCategoryDoc(category.toDto()));
  }
}
