import { CategoryDto } from '@Domains/category/category';
import { TrainingEventDto } from '@Domains/training-event/training-event';
import {
  TrainingMenuDto,
  TrainingMenuFullId,
} from '@Domains/training-menu/training-menu';
import { TrainingEventWithCategoryDto } from '@Usecases/training-event-query-usecase';
import {
  TrainingMenuCollectionQuery,
  TrainingMenuWithTrainingEventsDto,
} from '@Usecases/training-menu-collection-query-usecase';
import {
  fsCategoryCollection,
  fsConfigDocRef,
  fsTrainingEventDocRef,
  fsTrainingMenuDocRef,
  fsTrainingMenusCollectionRef,
  getDocManagedCache,
  getDocsManagedCache,
} from '../firestore-utils';

export class FSTrainingMenuCollectionQuery
  implements TrainingMenuCollectionQuery
{
  async queryDetail(prop: { userId: string }) {
    const [trainingMenusSnapshot, trainingMenuConfigSnapshot] =
      await Promise.all([
        getDocsManagedCache(fsTrainingMenusCollectionRef(prop)),
        getDocManagedCache(
          fsConfigDocRef({ ...prop, configId: 'trainingMenu' })
        ),
      ]);

    const trainingMenuMappedTrainingMenuId = Object.fromEntries(
      trainingMenusSnapshot.docs
        .filter((doc) => doc.exists())
        .map((doc) => [doc.id, doc.data() as TrainingMenuDto])
    );

    return {
      userId: prop.userId,
      trainingMenus: (trainingMenuConfigSnapshot
        ?.data()
        ?.orders.map(
          (trainingMenuId: string) =>
            trainingMenuMappedTrainingMenuId[trainingMenuId]
        ) ?? []) as TrainingMenuDto[],
    };
  }

  async queryTrainingMenuByTrainingMenuId(
    prop: TrainingMenuFullId
  ): Promise<TrainingMenuWithTrainingEventsDto | null> {
    const [trainingMenuSnapshot, categoriesSnapshot] = await Promise.all([
      getDocManagedCache(fsTrainingMenuDocRef(prop)),
      getDocsManagedCache(fsCategoryCollection(prop)),
    ]);
    const trainingMenuDto = trainingMenuSnapshot.data() as TrainingMenuDto;

    const categoryMappedCategoryId = Object.fromEntries(
      categoriesSnapshot.docs.map((doc) => [doc.id, doc.data()])
    );
    const trainingEvents = (
      await Promise.all(
        trainingMenuDto.trainingEventIds.map(async (trainingEventId) => {
          const trainingEventSnapshot = await getDocManagedCache(
            fsTrainingEventDocRef({ userId: prop.userId, trainingEventId })
          );

          if (!trainingEventSnapshot.exists()) {
            return null;
          }
          const trainingEventDto =
            trainingEventSnapshot.data() as TrainingEventDto;

          return {
            ...(categoryMappedCategoryId[
              trainingEventDto.categoryId
            ] as CategoryDto),
            ...trainingEventDto,
          };
        })
      )
    ).filter(
      (trainingEvent): trainingEvent is TrainingEventWithCategoryDto =>
        !!trainingEvent
    );

    return {
      ...trainingMenuDto,
      trainingEvents,
      trainingEventIds: trainingEvents.map(
        (trainingEvent) => trainingEvent.trainingEventId
      ),
    };
  }
}
