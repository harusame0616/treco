import dayjs from 'dayjs';
import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { ActivityDto, ActivityFullId } from '../../domains/activity/activity';
import { CategoryDto } from '../../domains/category/category';
import { TrainingEventDto } from '../../domains/training-event/training-event';
import {
  ActivityQuery,
  ActivityWithCategoryAndTrainingEventDto,
} from '../../usecases/activity-query-usecase';

export class FSActivityQuery implements ActivityQuery {
  async queryDetailOfLastTrainingEvent(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
  }): Promise<ActivityWithCategoryAndTrainingEventDto | null> {
    const categoryDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'categories',
      prop.categoryId
    );
    const trainingEventDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'trainingEvents',
      prop.trainingEventId
    );
    const activitiesCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'activities'
    );

    const queryActivityOfLastInTrainingEvent = query(
      activitiesCollectionRef,
      where('trainingEventId', '==', prop.trainingEventId),
      orderBy('date', 'desc'),
      limit(1)
    );

    let activitySnapshot = await getDocsFromCache(
      queryActivityOfLastInTrainingEvent
    );
    if (activitySnapshot.empty) {
      activitySnapshot = await getDocs(queryActivityOfLastInTrainingEvent);
    }

    let categorySnapshot = await getDocFromCache(categoryDocRef);
    if (!categorySnapshot.exists()) {
      categorySnapshot = await getDoc(categoryDocRef);
    }

    let trainingEventSnapshot = await getDocFromCache(trainingEventDocRef);
    if (trainingEventSnapshot.exists()) {
      trainingEventSnapshot = await getDoc(trainingEventDocRef);
    }

    if (activitySnapshot.empty) {
      return null;
    }

    const activity = activitySnapshot.docs[0].data() as any;
    return {
      ...categorySnapshot.data(),
      ...trainingEventSnapshot.data(),
      ...activity,
      date: activity.date.toDate(),
    };
  }
  async queryDetail(
    prop: ActivityFullId
  ): Promise<ActivityWithCategoryAndTrainingEventDto | null> {
    const activityDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'activities',
      prop.activityId
    );
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
      prop.userId,
      'categories',
      activityDto.categoryId
    );
    const trainingEventDocRef = doc(
      fbDb,
      'users',
      prop.userId,
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

  async queryListInMonth(prop: {
    userId: string;
    month: Date;
  }): Promise<ActivityWithCategoryAndTrainingEventDto[]> {
    const activitiesCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'activities'
    );
    const categoriesCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'categories'
    );
    const trainingEventsCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'trainingEvents'
    );

    const activityOwnedUserInMonthQuery = query(
      activitiesCollectionRef,
      where('date', '>=', dayjs(prop.month).startOf('month').toDate()),
      where('date', '<=', dayjs(prop.month).endOf('month').toDate())
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
        return [trainingEvent.trainingEventId, trainingEvent];
      })
    );

    return snapshot.docs
      .map((doc) => {
        const activity = doc.data();
        const categoryInfo = categoryMappedCategoryId[activity.categoryId];
        const trainingEventInfo =
          trainingEventMappedTrainingEventId[activity.trainingEventId];

        return activity && categoryInfo && trainingEventInfo
          ? {
              ...categoryInfo,
              ...trainingEventInfo,
              ...activity,
              date: activity.date?.toDate(),
            }
          : undefined;
      })
      .filter((activity) => activity) as any[];
  }
}
