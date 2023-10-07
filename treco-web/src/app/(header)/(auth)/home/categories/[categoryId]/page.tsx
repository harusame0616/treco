import { Button } from '@/components/ui/button';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function createNewRecords() {
  'use server';

  const trainingCategory = 1;
  const trainingEventId = 1;
  const trainingRecordId = 1;

  redirect(
    `/home/categories/${trainingCategory}/events/${trainingEventId}/records/${trainingRecordId}`
  );
}

export default async function TrainingEventPage() {
  const category = {
    id: 1,
    name: '胸',
    color: '#db4d6d',
  };
  const trainingEvents = [
    { id: 1, name: 'ベンチプレス' },
    { id: 2, name: 'ダンベルフライ' },
    { id: 3, name: 'チェストプレス' },
    { id: 4, name: 'チェストフライ' },
    { id: 5, name: 'ケーブルクロスオーバーロー' },
    { id: 6, name: 'ケーブルフライ' },
    { id: 7, name: 'プッシュアップ' },
  ];

  return (
    <div className="px-4">
      <h2 className="font-bold text-lg mb-4 sr-only">トレーニング種目選択</h2>
      <p className="mb-4">トレーニング種目を選択してください</p>
      <nav className="mb-4">
        <span style={{ color: category.color }}>●</span> 胸
      </nav>

      <ul aria-label={`${category.name}のトレーニング種目`} className="w-full">
        {trainingEvents.map(({ id: trainingEventId, name }) => (
          <li
            key={trainingEventId}
            data-before="●"
            className={`flex m-2 text-lg  snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
            aria-label={name}
          >
            <div className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16">
              <form action={createNewRecords}>
                <button className="text-foreground block w-full no-underline text-left">
                  <span className="text-3xl grow">{name}</span>
                </button>
              </form>
              <Button variant={'ghost'} aria-label="トレーニング種目名編集">
                <Pencil2Icon className="w-6 h-6" aria-hidden="true" />
              </Button>
            </div>
            <Button
              className="ml-4 snap-start w-16 h-16"
              size="icon"
              aria-label="削除"
            >
              <TrashIcon className="w-14 h-12" aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
