import {
  deleteDoc, limit,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import {
  TrainingEvent,
  TrainingEventFullId
} from '../../domains/training-event/training-event';
import { TrainingEventRepository } from '../../usecases/training-event-command-usecase';
import {
  fsTrainingEventCollectionRef,
  fsTrainingEventDocRef,
  getDocManagedCache,
  getDocsManagedCache
} from '../firestore-utils';

export class FSTrainigEventRepository implements TrainingEventRepository {
  async save(trainingEvent: TrainingEvent) {
    const dto = trainingEvent.toDto();

    await setDoc(fsTrainingEventDocRef(dto), dto);
  }

  async findOneByTrainingEventId(
    prop: TrainingEventFullId
  ): Promise<TrainingEvent | null> {
    const trainigEventDto = await getDocManagedCache(
      fsTrainingEventDocRef(prop)
    );

    return trainigEventDto.exists()
      ? TrainingEvent.fromDto(trainigEventDto.data() as any)
      : null;
  }

  async findOneByTrainingEventName(prop: {
    userId: string;
    categoryId: string;
    trainingEventName: string;
  }): Promise<TrainingEvent | null> {
    let trainingEvents = await getDocsManagedCache(
      query(
        fsTrainingEventCollectionRef(prop),
        where('trainingEventName', '==', prop.trainingEventName)
      )
    );

    return trainingEvents.empty
      ? null
      : TrainingEvent.fromDto(trainingEvents.docs[0].data() as any);
  }

  async findOneByLastOrder(prop: {
    userId: string;
    categoryId: string;
  }): Promise<TrainingEvent | null> {
    let trainingEvents = await getDocsManagedCache(
      query(
        fsTrainingEventCollectionRef(prop),
        orderBy('order', 'desc'),
        limit(1)
      )
    );

    return trainingEvents.empty
      ? null
      : TrainingEvent.fromDto(trainingEvents.docs[0].data() as any);
  }

  async deleteTrainingEvent(trainingEvent: TrainingEvent): Promise<void> {
    await deleteDoc(fsTrainingEventDocRef(trainingEvent.toDto()));
  }
}
