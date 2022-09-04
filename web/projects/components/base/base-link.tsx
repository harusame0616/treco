import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface Prop {
  href: string;
  children: ReactNode;
}

const BaseLink = (prop: Prop) => {
  return (
    <NextLink href={prop.href} passHref>
      <Link>{prop.children}</Link>
    </NextLink>
  );
};

export default BaseLink;
