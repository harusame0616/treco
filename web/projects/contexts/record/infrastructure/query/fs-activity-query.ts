import dayjs from 'dayjs';
import {
  collection,
  getDocs,
  getDocsFromCache,
  query,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import {
  ActivityQuery,
  ActivityWithCategoryAndTrainingEventDto,
} from '../../usecases/activity-query-usecase';

export class FSActivityQuery implements ActivityQuery {
  async queryListInMonth(
    userId: string,
    month: Date
  ): Promise<ActivityWithCategoryAndTrainingEventDto[]> {
    const activitiesCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'activities'
    );
    const categoriesCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'categories'
    );
    const trainingEventsCollectionRef = collection(
      fbDb,
      'users',
      userId,
      'trainingEvents'
    );

    const activityOwnedUserInMonthQuery = query(
      activitiesCollectionRef,
      where('date', '>=', dayjs(month).startOf('month').toDate()),
      where('date', '<=', dayjs(month).endOf('month').toDate())
    );

    let snapshot = await getDocsFromCache(activityOwnedUserInMonthQuery);
    if (snapshot.empty) {
      snapshot = await getDocs(activityOwnedUserInMonthQuery);
    }

    let categoriesSnapshot = await getDocsFromCache(categoriesCollectionRef);
    if (categoriesSnapshot.empty) {
      categoriesSnapshot = await getDocs(categoriesCollectionRef);
    }

    let trainingEventsSnapshot = await getDocsFromCache(
      trainingEventsCollectionRef
    );
    if (trainingEventsSnapshot.empty) {
      trainingEventsSnapshot = await getDocs(trainingEventsCollectionRef);
    }

    const categoryMappedCategoryId = Object.fromEntries(
      categoriesSnapshot.docs.map((doc) => {
        const category = doc.data();
        return [category.categoryId, category];
      })
    );

    const trainingEventMappedTrainingEventId = Object.fromEntries(
      trainingEventsSnapshot.docs.map((doc) => {
        const trainingEvent = doc.data();
        return [trainingEvent.trainigEventId, trainingEvent];
      })
    );

    return snapshot.docs.map((doc) => {
      const activity = doc.data();
      return {
        ...(categoryMappedCategoryId[activity.categoryId] ?? {}),
        ...(trainingEventMappedTrainingEventId[activity.trainigEventId] ?? {}),
        ...activity,
        date: activity.date?.toDate(),
      };
    }) as any[];
  }
}
