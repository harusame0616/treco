import { TrainingMenuDto } from '@Domains/training-menu/training-menu';
import { TrainingMenuCollectionQuery } from '@Usecases/training-menu-collection-query-usecase';
import {
  fsConfigDocRef,
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
      trainingMenusSnapshot.docs.map((doc) => [
        doc.id,
        doc.data() as TrainingMenuDto,
      ])
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
}
