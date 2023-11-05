import clsx from 'clsx';

import { Skeleton } from './ui/skeleton';

const sizeMap = {
  large: 'w-16 h-16',
  middle: 'w-8 h-8',
  small: 'w-4 h-4',
  'x-small': 'w-2 h-2',
};

type Size = keyof typeof sizeMap;

type SkeletonProps = {
  isSkeleton: true;
};

type NormalProps = {
  color: string;
  isSkeleton?: false;
};

type Props = (NormalProps | SkeletonProps) & {
  size: Size;
};

export function TrainingMark(props: Props) {
  const size = sizeMap[props.size];

  return props.isSkeleton ? (
    <Skeleton className={clsx(size, 'rounded-full')} />
  ) : (
    <div
      className={clsx(size, 'rounded-full')}
      style={{ backgroundColor: props.color }}
    />
  );
}
