import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';

export default function TrainingRecordEditPage() {
  const trainingCategory = {
    id: 1,
    name: '胸',
    color: '#db4d6d',
  };
  const trainingEvent = {
    id: 1,
    name: 'ベンチプレス',
  };

  const records = [
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考\nテスト' },
    { id: '1', load: '100', value: '10', note: '備考\nテスト\nテスト' },
    { id: '1', load: '100', value: '10', note: '備考\nテスト\nテスト\nテスト' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
    { id: '1', load: '100', value: '10', note: '備考' },
  ];

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full px-4 shrink-0">
        <span style={{ color: trainingCategory.color }} className="mr-2">
          ●
        </span>
        <span>{trainingCategory.name}</span>
        <span className="mx-2">&gt;</span>
        <span>{trainingEvent.name}</span>
      </div>
      <div className="flex top-11 p-2 shrink-0 text-xs text-muted-foreground">
        <div className="w-12">セット</div>
        <div className="w-12 ml-1">負荷</div>
        <div className="w-10 ml-4">値</div>
        <div className="flex-grow">備考</div>
      </div>
      <div className="bg-muted px-4 h-full overflow-y-scroll">
        <ul className="">
          {records.map(({ id, load, value, note }, index) => (
            <li
              key={id}
              className="flex border-b border-b-muted-foreground border-dashed last:border-b-0 h-20"
            >
              <div className="w-4 text-xs flex justify-end items-center text-muted-foreground mr-1">
                {index + 1}
              </div>
              <div className="w-12 flex items-center justify-end mr-1">
                {load}
              </div>
              <div className="w-12 flex items-center justify-end mr-8">
                {value}
              </div>
              <div className="flex items-center grow">
                <div className="w-12 flex-grow text-xs whitespace-pre text-ellipsis line-clamp-3 max-h-12">
                  {note}
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon">
                  <TrashIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="shrink-0 p-4 gap-1 flex flex-col">
        <div className="flex gap-4">
          <label className="flex items-center">
            <div className="mr-2 shrink-0">負荷</div>
            <Input inputMode="decimal" type="number" />
          </label>
          <label className="flex items-center">
            <div className="mr-2 shrink-0">値</div>
            <Input inputMode="decimal" type="number" />
          </label>
        </div>
        <label className="flex">
          <div className="shrink-0 mr-2">備考</div>
          <Textarea className="grow h-1" />
        </label>
        <div className="flex justify-end">
          <Button>追加</Button>
        </div>
      </div>
    </div>
  );
}
