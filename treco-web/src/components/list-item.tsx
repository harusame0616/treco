import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComponentProps, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  className?: string;
}>;
export function ListItem({ children, className }: Props) {
  return (
    <li className={cn('w-full rounded-md bg-muted', className)}>{children}</li>
  );
}

type ListItemWithActionProps = PropsWithChildren<{
  action: React.ReactNode;
  className?: string;
}>;
export function ListItemWithAction({
  action,
  children,
  className,
}: ListItemWithActionProps) {
  return (
    <ListItem className={cn('flex', className)}>
      <div className="grow">{children}</div>
      <div className="flex items-center gap-1 px-4">{action}</div>
    </ListItem>
  );
}

type LinkListItemWithActionProps = PropsWithChildren<{
  action: React.ReactNode;
  className?: string;
  href: ComponentProps<typeof Link>['href'];
}>;
export function LinkListItemWithAction({
  action,
  children,
  href,
}: LinkListItemWithActionProps) {
  return (
    <ListItemWithAction action={action}>
      <Link
        className="flex grow items-center gap-4 p-4 text-foreground no-underline"
        href={href}
      >
        {children}
      </Link>
    </ListItemWithAction>
  );
}
