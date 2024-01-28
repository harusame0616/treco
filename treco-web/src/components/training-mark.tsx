import clsx from 'clsx';

import { Skeleton } from './ui/skeleton';

const sizeMap = {
  large: 'w-16 h-16',
  middle: 'w-8 h-8',
  small: 'w-4 h-4',
  'x-small': 'w-2 h-2',
};

type Size = keyof typeof sizeMap;

type NormalProps = {
  color: string;
  isSkeleton?: false;
  size: Size;
};

type SkeletonProps = Pick<NormalProps, 'size'> & {
  color?: string;
  isSkeleton: true;
};

type Props = NormalProps | SkeletonProps;

export function TrainingMark({ color, isSkeleton, size }: Props) {
  const sizeClass = sizeMap[size];

  return isSkeleton ? (
    <Skeleton className={clsx(sizeClass, 'rounded-full')} />
  ) : (
    <div
      className={clsx(sizeClass, 'rounded-full')}
      style={{ backgroundColor: color }}
    />
  );
}
