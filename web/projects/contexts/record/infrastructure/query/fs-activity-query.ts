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
import {
  ActivityDto,
  ActivityFullId,
  ActivityRecord,
} from '../../domains/activity/activity';
import { CategoryDto } from '../../domains/category/category';
import { TrainingEventDto } from '../../domains/training-event/training-event';
import {
  ActivityQuery,
  ActivityQueryDetail,
  ActivityWithCategoryAndTrainingEventDto,
} from '../../usecases/activity-query-usecase';
import {
  fsActivityCollection,
  fsCategoryCollection,
  fsRecordsCollection,
  fsTrainingEventCollectionRef,
  getDocsManagedCache,
} from '../firestore-utils';

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
  }): Promise<ActivityQueryDetail[]> {
    const activitiesCollectionRef = fsActivityCollection(prop);
    const categoriesCollectionRef = fsCategoryCollection(prop);
    const trainingEventsCollectionRef = fsTrainingEventCollectionRef(prop);

    const activityOwnedUserInMonthQuery = query(
      activitiesCollectionRef,
      where('date', '>=', dayjs(prop.month).startOf('month').toDate()),
      where('date', '<=', dayjs(prop.month).endOf('month').toDate())
    );

    let [snapshot, categoriesSnapshot, trainingEventsSnapshot] =
      await Promise.all([
        getDocsManagedCache(activityOwnedUserInMonthQuery),
        getDocsManagedCache(categoriesCollectionRef),
        getDocsManagedCache(trainingEventsCollectionRef),
      ]);

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
          const recordsCollection = fsRecordsCollection(activity as any);
          let recordsSnapshot = await getDocsManagedCache(recordsCollection);

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
    )
      .filter((activity) => activity)
      .sort((a, b) => a.createdAt - b.createdAt) as any[];
  }

  async queryListOnDate(prop: {
    userId: string;
    date: Date;
  }): Promise<ActivityQueryDetail[]> {
    const activitiesCollectionRef = fsActivityCollection(prop);
    const categoriesCollectionRef = fsCategoryCollection(prop);
    const trainingEventsCollectionRef = fsTrainingEventCollectionRef(prop);

    const activityOwnedUserOnDateQuery = query(
      activitiesCollectionRef,
      where('date', '>=', dayjs(prop.date).startOf('date').toDate()),
      where('date', '<=', dayjs(prop.date).endOf('date').toDate())
    );

    const [activitiesSnapshot, categoriesSnapshot, trainingEventsSnapshot] =
      await Promise.all([
        getDocsManagedCache(activityOwnedUserOnDateQuery),
        getDocsManagedCache(categoriesCollectionRef),
        getDocsManagedCache(trainingEventsCollectionRef),
      ]);

    const categoryMappedCategoryId = Object.fromEntries(
      categoriesSnapshot.docs.map((doc) => [doc.id, doc.data()])
    );

    const trainingEventMappedTrainingEventId = Object.fromEntries(
      trainingEventsSnapshot.docs.map((doc) => [doc.id, doc.data()])
    );

    return (
      await Promise.all(
        activitiesSnapshot.docs.map(async (doc) => {
          const activity = doc.data() as ActivityDto;
          const categoryInfo = categoryMappedCategoryId[activity.categoryId];
          const trainingEventInfo =
            trainingEventMappedTrainingEventId[activity.trainingEventId];
          const recordsCollectionRef = fsRecordsCollection(activity);
          let recordsSnapshot = await getDocsManagedCache(recordsCollectionRef);

          if (activity && categoryInfo && trainingEventInfo) {
            return {
              ...categoryInfo,
              ...trainingEventInfo,
              ...activity,
              date: (activity.date as any).toDate(),
              records: recordsSnapshot.empty
                ? []
                : recordsSnapshot.docs
                    .map((doc) => doc.data())
                    .sort((a: any, b: any) => a.index - b.index),
            };
          }
          return undefined;
        })
      )
    ).filter((activity) => activity) as any[];
  }

  async queryDetailOfmaxRM(prop: {
    userId: string;
    trainingEventId: string;
  }): Promise<(ActivityDto & { maxRM: number }) | null> {
    const activityCollectionRef = fsActivityCollection(prop);
    const querymaxRM = query(
      activityCollectionRef,
      where('trainingEventId', '==', prop.trainingEventId),
      orderBy('maxRM', 'desc'),
      limit(1)
    );

    const activitymaxRM = await getDocsManagedCache(querymaxRM);
    if (activitymaxRM.empty) {
      return null;
    }

    return activitymaxRM.docs[0].data() as ActivityDto & { maxRM: number };
  }
}
