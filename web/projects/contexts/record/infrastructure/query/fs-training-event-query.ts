import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  query,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { CategoryDto } from '../../domains/category/category';
import { TrainingEventDto } from '../../domains/training-event/training-event';
import {
  TrainingEventQuery,
  TrainingEventWithCategoryDto,
} from '../../usecases/training-event-query-usecase';

export class FSTrainingEventQuery implements TrainingEventQuery {
  async queryDetail(
    userId: string,
    categoryId: string,
    trainingEventId: string
  ) {
    const trainingEventDocRef = doc(
      fbDb,
      'users',
      userId,
      'trainingEvents',
      trainingEventId
    );

    let trainingEventSnapshot = await getDocFromCache(trainingEventDocRef);
    if (!trainingEventSnapshot.exists()) {
      trainingEventSnapshot = await getDoc(trainingEventDocRef);
    }

    const categoryDocRef = doc(fbDb, 'users', userId, 'categories', categoryId);
    let categorySnapshot = await getDocFromCache(categoryDocRef);
    if (!categorySnapshot.exists()) {
      categorySnapshot = await getDoc(categoryDocRef);
    }

    if (!categorySnapshot.exists() || !trainingEventSnapshot.exists()) {
      return null;
    }

    return {
      ...(categorySnapshot.data() as CategoryDto),
      ...(trainingEventSnapshot.data() as TrainingEventDto),
    };
  }

  async queryListInCategory(
    userId: string,
    categoryId: string
  ): Promise<TrainingEventWithCategoryDto[]> {
    const trainingEventsCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'trainingEvents'
    );

    const inCategoryQuery = query(
      trainingEventsCollectionRef,
      where('categoryId', '==', categoryId)
    );
    let trainingEventsSnapshot = await getDocsFromCache(inCategoryQuery);
    if (trainingEventsSnapshot.empty) {
      trainingEventsSnapshot = await getDocs(inCategoryQuery);
    }

    const categoryDocRef = doc(fbDb, 'users', userId, 'categories', categoryId);
    let categorySnapshot = await getDocFromCache(categoryDocRef);
    if (!categorySnapshot.exists()) {
      trainingEventsSnapshot = await getDocs(trainingEventsCollectionRef);
    }

    const categoryDto: CategoryDto = categorySnapshot.data() as CategoryDto;

    return trainingEventsSnapshot.docs.map((doc) => {
      return {
        ...categoryDto,
        ...(doc.data() as TrainingEventDto),
      };
    });
  }
}
