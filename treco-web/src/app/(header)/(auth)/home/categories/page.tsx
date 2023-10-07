import { Button } from '@/components/ui/button';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
export default async function CategoryPage() {
  const categories = [
    { id: 1, name: '胸', color: '#db4d6d' },
    { id: 2, name: '背中', color: '#86c166' },
    { id: 3, name: '脚', color: '#f596aa' },
    { id: 4, name: '肩', color: '#caad5f' },
    { id: 5, name: '腕', color: '#fcfaf2' },
  ];

  return (
    <div>
      <ul aria-label="トレーニングカテゴリー" className="w-full">
        {categories.map(({ id: categoryId, name, color }) => (
          <li
            key={categoryId}
            data-before="●"
            className={`flex m-2 text-lg  snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
            aria-label={name}
          >
            <div className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16">
              <Link
                href={`/home/categories/${categoryId}`}
                className="text-foreground block w-full no-underline"
              >
                <span
                  className="mr-4 text-lg"
                  style={{ color }}
                  aria-hidden="true"
                >
                  ●
                </span>
                <span className="text-3xl grow">{name}</span>
              </Link>
              <Button variant={'ghost'} aria-label="カテゴリ名編集">
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
