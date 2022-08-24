import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { Category } from '../../domains/category/category';
import { CategoryRepository } from '../../usecases/category-command-usecase';

export class FSCategoryRepository implements CategoryRepository {
  async save(category: Category) {
    const dto = category.toDto();

    await setDoc(
      doc(fbDb, 'users', dto.userId, 'categories', dto.categoryId),
      dto
    );
  }

  async findOneByCategoryId(prop: {
    userId: string;
    categoryId: string;
  }): Promise<Category | null> {
    const docRef = doc(
      fbDb,
      'users',
      prop.userId,
      'categories',
      prop.categoryId
    );

    let categoryDto = await getDocFromCache(docRef);
    if (!categoryDto.exists()) {
      categoryDto = await getDoc(docRef);
    }

    return categoryDto.exists()
      ? Category.fromDto(categoryDto.data() as any)
      : null;
  }
  async findOneByCategoryName(prop: {
    userId: string;
    categoryName: string;
  }): Promise<Category | null> {
    const collectionRef = collection(fbDb, 'users', prop.userId, 'categories');

    const categoryNameQuery = query(
      collectionRef,
      where('categoryName', '==', prop.categoryName),
      limit(1)
    );

    let categories = await getDocsFromCache(categoryNameQuery);
    if (!categories.empty) {
      categories = await getDocs(categoryNameQuery);
    }

    return categories.empty
      ? null
      : Category.fromDto(categories.docs[0].data() as any);
  }
}