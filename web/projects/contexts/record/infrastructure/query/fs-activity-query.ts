import dayjs from 'dayjs';
import {
  collection,
  collectionGroup,
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
import {
  ActivityDto,
  ActivityFullId,
  ActivityRecord,
} from '../../domains/activity/activity';
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
    const recordsCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'activities',
      activity.activityId,
      'records'
    );
    let recordsSnapshot = await getDocsFromCache(recordsCollectionRef);
    if (!recordsSnapshot.empty) {
      recordsSnapshot = await getDocs(recordsCollectionRef);
    }

    return {
      ...categorySnapshot.data(),
      ...trainingEventSnapshot.data(),
      ...activity,
      date: activity.date.toDate(),
      records: recordsSnapshot.empty
        ? []
        : recordsSnapshot.docs
            .map((doc) => doc.data() as any)
            .sort((a, b) => a.index - b.index),
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

    const recordsCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'activities',
      prop.activityId,
      'records'
    );
    let recordsSnapshot = await getDocsFromCache(recordsCollectionRef);
    if (!recordsSnapshot.empty) {
      recordsSnapshot = await getDocs(recordsCollectionRef);
    }

    return {
      ...(categorySnapshot.data() as CategoryDto),
      ...(trainingEventSnapshot.data() as TrainingEventDto),
      ...activityDto,
      records: recordsSnapshot.empty
        ? []
        : recordsSnapshot.docs
            .map((doc) => doc.data() as ActivityRecord)
            .sort((a: any, b: any) => a.index - b.index),
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
    const recordsCollectionGroupRef = collectionGroup(fbDb, 'records');

    const activityOwnedUserInMonthQuery = query(
      activitiesCollectionRef,
      where('date', '>=', dayjs(prop.month).startOf('month').toDate()),
      where('date', '<=', dayjs(prop.month).endOf('month').toDate())
    );
    const recordsOwnedUserInMOnthQuery = query(
      recordsCollectionGroupRef,
      where('userId', '==', prop.userId),
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

    return (
      await Promise.all(
        snapshot.docs.map(async (doc) => {
          const activity = doc.data();
          const categoryInfo = categoryMappedCategoryId[activity.categoryId];
          const trainingEventInfo =
            trainingEventMappedTrainingEventId[activity.trainingEventId];
          // const records = recordsAggregatedActivityId[activity.activityId];
          const recordsCollection = collection(
            fbDb,
            'users',
            activity.userId,
            'activities',
            activity.activityId,
            'records'
          );
          let recordsSnapshot = await getDocsFromCache(recordsCollection);
          if (recordsSnapshot.empty) {
            recordsSnapshot = await getDocs(recordsCollection);
          }

          return activity && categoryInfo && trainingEventInfo
            ? {
                ...categoryInfo,
                ...trainingEventInfo,
                ...activity,
                date: activity.date?.toDate(),
                records: recordsSnapshot.empty
                  ? []
                  : recordsSnapshot.docs
                      .map((doc) => doc.data())
                      .sort((a: any, b: any) => a.index - b.index),
              }
            : undefined;
        })
      )
    ).filter((activity) => activity) as any[];
  }
}
