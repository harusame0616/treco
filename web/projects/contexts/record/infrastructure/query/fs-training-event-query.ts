import {
  collection,
  doc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { CategoryDto } from '../../domains/category/category';
import { TrainingEventDto } from '../../domains/training-event/training-event';
import {
  TrainingEventQuery,
  TrainingEventWithCategoryDto,
} from '../../usecases/training-event-query-usecase';

export class FSTrainingEventQuery implements TrainingEventQuery {
  async queryListInCategory(
    userId: string,
    categoryId: string
  ): Promise<TrainingEventWithCategoryDto[]> {
    const trainingEventsCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'categories',
      categoryId,
      'trainingEvents'
    );
    let trainingEventsSnapshot = await getDocsFromCache(
      trainingEventsCollectionRef
    );
    if (trainingEventsSnapshot.empty) {
      trainingEventsSnapshot = await getDocs(trainingEventsCollectionRef);
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
