import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth/auth';
import { generateId } from '@/lib/id';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { createNewRecordAction } from './actions';

export default async function TrainingEventPage() {
  const session = await getSession();
  const category = {
    id: generateId(),
    name: '胸',
    color: '#db4d6d',
  };
  const trainingEvents = [
    { id: generateId(), name: 'ベンチプレス' },
    { id: generateId(), name: 'ダンベルフライ' },
    { id: generateId(), name: 'チェストプレス' },
    { id: generateId(), name: 'チェストフライ' },
    { id: generateId(), name: 'ケーブルクロスオーバーロー' },
    { id: generateId(), name: 'ケーブルフライ' },
    { id: generateId(), name: 'プッシュアップ' },
  ];

  return (
    <div className="px-4">
      <h2 className="sr-only">トレーニング種目選択</h2>
      <p className="mb-4">トレーニング種目を選択してください</p>
      <nav className="mb-4">
        <span style={{ color: category.color }}>●</span> 胸
      </nav>

      <ul aria-label={`${category.name}のトレーニング種目`} className="w-full">
        {trainingEvents.map(({ id: trainingEventId, name }) => (
          <li
            key={trainingEventId}
            data-before="●"
            className={`flex m-2 snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
            aria-label={name}
          >
            <form
              action={createNewRecordAction}
              className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16"
            >
              <input type="hidden" value={session.sub} />
              <input
                type="hidden"
                name="trainingCategoryId"
                value={category.id}
              />
              <input
                type="hidden"
                name="trainingEventId"
                value={trainingEventId}
              />
              <input type="hidden" name="traineeId" value={trainingEventId} />
              <button className="text-foreground block w-full no-underline text-left whitespace-nowrap overflow-x-hidden text-ellipsis">
                <span className="text-xl grow ">{name}</span>
              </button>
              <Button variant={'ghost'} aria-label="トレーニング種目名編集">
                <Pencil2Icon className="w-6 h-6" aria-hidden="true" />
              </Button>
            </form>
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
