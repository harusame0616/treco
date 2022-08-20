import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { CategoryDto } from '../../domains/category/category';
import { CategoryQuery } from '../../usecases/category-query-usecase';

export class FSCategoryQuery implements CategoryQuery {
  async queryDetail(userId: string, categoryId: string) {
    const categoryDocRef = doc(fbDb, 'users', userId, 'categories', categoryId);

    let snapshot = await getDocFromCache(categoryDocRef);
    if (snapshot.exists()) {
      snapshot = await getDoc(categoryDocRef);
    }

    return snapshot.exists() ? (snapshot.data() as CategoryDto) : null;
  }

  async queryList(userId: string): Promise<CategoryDto[]> {
    const categoriesCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'categories'
    );

    let snapshot = await getDocsFromCache(categoriesCollectionRef);
    if (snapshot.empty) {
      snapshot = await getDocs(categoriesCollectionRef);
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        color: data.color,
      };
    });
  }
}
