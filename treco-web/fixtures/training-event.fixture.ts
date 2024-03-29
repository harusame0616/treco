import { TrainingEventDto } from '@/domains/training-event/models/training-event';

import { trainingCategoryFixtures } from './training-category.fixture';

export const trainingEventFixtures = [
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ベンチプレス',
    order: 1,
    trainingEventId: 'd4fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ダンベルプレス',
    order: 2,
    trainingEventId: 'd5fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ダンベルフライ',
    order: 3,
    trainingEventId: 'd6fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ケーブルクロスオーバー',
    order: 4,
    trainingEventId: 'd7fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ケーブルフライ',
    order: 5,
    trainingEventId: 'd8fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'チェストプレスマシン',
    order: 6,
    trainingEventId: 'd9fd917c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'バタフライマシン',
    order: 7,
    trainingEventId: 'd9fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: '腕立てふせ',
    order: 8,
    trainingEventId: 'a0fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'バーベルスクワット',
    order: 0,
    trainingEventId: 'a1fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ブルガリアンスクワット',
    order: 1,
    trainingEventId: 'a2fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ヒップスラスト',
    order: 2,
    trainingEventId: 'a3fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグプレス',
    order: 3,
    trainingEventId: 'a4fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ハムストリングカール',
    order: 4,
    trainingEventId: 'a5fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグエクステンション',
    order: 5,
    trainingEventId: 'a6fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグレイズ',
    order: 6,
    trainingEventId: 'a7fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ランジ',
    order: 7,
    trainingEventId: 'a8fd918c-86c9-895e-5a8c-2490e04dd600',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'アブローラー',
    order: 0,
    trainingEventId: 'b0fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'プランク',
    order: 1,
    trainingEventId: 'b1fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '分',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'シットアップ',
    order: 2,
    trainingEventId: 'b2fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'レッグレイズ',
    order: 3,
    trainingEventId: 'b3fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'ショルダープレス',
    order: 0,
    trainingEventId: 'b4fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'サイドレイズ',
    order: 1,
    trainingEventId: 'b5fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'リアレイズ',
    order: 2,
    trainingEventId: 'b6fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'フロントレイズ',
    order: 3,
    trainingEventId: 'b7fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'アップライトロウ',
    order: 4,
    trainingEventId: 'b8fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回 ',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'デッドリフト',
    order: 5,
    trainingEventId: 'b9fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'ベントオーバーロー',
    order: 6,
    trainingEventId: 'c0fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'ラットプルダウン',
    order: 7,
    trainingEventId: 'c1fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'シーテッドローイング',
    order: 8,
    trainingEventId: 'c2fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'チンニング',
    order: 9,
    trainingEventId: 'c3fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'バックエクステンション',
    order: 10,
    trainingEventId: 'c4fd918c-86c9-895e-5a8c-2490e04dd60a',
    valueUnit: '回',
  },
];

export function createTrainingEventFixtures(
  categories: typeof trainingCategoryFixtures,
  traineeId: string,
): TrainingEventDto[] {
  return trainingEventFixtures.map((event) => {
    const trainingCategoryId = categories.find(
      (category) => category.name === event.categoryName,
    )?.trainingCategoryId;

    if (!trainingCategoryId) {
      console.error('training category id is not found', {
        data: {
          categories,
          event,
        },
        func: createTrainingEventFixtures.name,
      });
      throw new Error('training category id is not found');
    }

    return {
      ...event,
      traineeId,
      trainingCategoryId,
    };
  });
}
