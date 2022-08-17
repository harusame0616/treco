import { Box } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import BaseCard from '../base/base-card';

interface Prop {
  children: ReactNode;
  onClick?: MouseEventHandler;
}

const ListItemCard = (prop: Prop) => {
  return (
    <BaseCard onClick={prop.onClick}>
      <Box fontSize="1.5rem">{prop.children}</Box>
    </BaseCard>
  );
};

export default ListItemCard;
