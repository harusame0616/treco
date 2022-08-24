import dayjs from 'dayjs';
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
import { ActivityDto } from '../../domains/activity/activity';
import { CategoryDto } from '../../domains/category/category';
import { TrainingEventDto } from '../../domains/training-event/training-event';
import {
  ActivityQuery,
  ActivityWithCategoryAndTrainingEventDto,
} from '../../usecases/activity-query-usecase';

export class FSActivityQuery implements ActivityQuery {
  async queryDetail(
    userId: string,
    categoryId: string,
    trainingEventId: string,
    activityId: string
  ): Promise<ActivityWithCategoryAndTrainingEventDto | null> {
    const activityDocRef = doc(fbDb, 'users', userId, 'activities', activityId);
    let activitySnapshot = await getDocFromCache(activityDocRef);
    if (activitySnapshot.exists()) {
      activitySnapshot = await getDoc(activityDocRef);
    }
    if (!activitySnapshot.exists()) {
      return null;
    }

    const activityDto = activitySnapshot.data() as ActivityDto;

    const categoryDocRef = doc(
      fbDb,
      'users',
      userId,
      'categories',
      activityDto.categoryId
    );
    const trainingEventDocRef = doc(
      fbDb,
      'users',
      userId,
      'trainingEvents',
      activityDto.trainingEventId
    );

    let categorySnapshot = await getDocFromCache(categoryDocRef);
    if (!categorySnapshot.exists()) {
      categorySnapshot = await getDoc(categoryDocRef);
    }

    let trainingEventSnapshot = await getDocFromCache(trainingEventDocRef);
    if (!trainingEventSnapshot.exists()) {
      trainingEventSnapshot = await getDoc(trainingEventDocRef);
    }

    if (!categorySnapshot.exists() || !trainingEventSnapshot.exists()) {
      return null;
    }

    return {
      ...(categorySnapshot.data() as CategoryDto),
      ...(trainingEventSnapshot.data() as TrainingEventDto),
      ...activityDto,
    };
  }
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
