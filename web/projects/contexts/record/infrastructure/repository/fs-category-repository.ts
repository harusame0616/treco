import {
  collection,
  doc,
  getDocs,
  getDocsFromCache,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { Category } from '../../domains/category/category';
import { CategoryRepository } from '../../usecases/category-command-usecase';

export class FSCategoryRepository implements CategoryRepository {
  async insert(category: Category) {
    const dto = category.toDto();

    await setDoc(
      doc(fbDb, 'users', dto.userId, 'categories', dto.categoryId),
      dto
    );
  }

  async findOneByCategoryName(prop: {
    userId: string;
    categoryName: string;
  }): Promise<Category | null> {
    const activityCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'categories'
    );

    const categoryNameQuery = query(
      activityCollectionRef,
      where('categoryName', '==', prop.categoryName)
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
