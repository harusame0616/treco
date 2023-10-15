const defaultEvents = [
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ベンチプレス',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ダンベルプレス',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ダンベルフライ',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ケーブルクロスオーバー',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'ケーブルフライ',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'チェストプレスマシン',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: 'バタフライマシン',
    valueUnit: '回',
  },
  {
    categoryName: '胸',
    loadUnit: 'kg',
    name: '腕立てふせ',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'バーベルスクワット',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ブルガリアンスクワット',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ヒップスラスト',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグプレス',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ハムストリングカール',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグエクステンション',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'レッグレイズ',
    valueUnit: '回',
  },
  {
    categoryName: '脚',
    loadUnit: 'kg',
    name: 'ランジ',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'アブローラー',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'プランク',
    valueUnit: '分',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'シットアップ',
    valueUnit: '回',
  },
  {
    categoryName: '腹',
    loadUnit: 'kg',
    name: 'レッグレイズ',
    valueUnit: '回',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'ショルダープレス',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'サイドレイズ',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'リアレイズ',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'フロントレイズ',
    valueUnit: '回 ',
  },
  {
    categoryName: '肩',
    loadUnit: 'kg',
    name: 'アップライトロウ',
    valueUnit: '回 ',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'デッドリフト',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'ベントオーバーロー',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'ラットプルダウン',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'シーテッドローイング',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'チンニング',
    valueUnit: '回',
  },
  {
    categoryName: '背中',
    loadUnit: 'kg',
    name: 'バックエクステンション',
    valueUnit: '回',
  },
];

export function getDefaultEvents(categoryName: string) {
  return [
    ...defaultEvents.filter((event) => event.categoryName === categoryName),
  ];
}
