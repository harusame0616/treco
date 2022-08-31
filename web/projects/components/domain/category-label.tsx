import { Box } from '@mui/material';
import { ReactNode } from 'react';
import TrainingMark from './training-mark';

const sizeList = ['small', 'medium', 'large'] as const;
type Size = typeof sizeList[number];

interface Prop {
  color?: string;
  textColor?: string;
  children: ReactNode;
  size?: Size;
}

interface SizeSet {
  fontSize: string;
  markSize: string;
  space: string;
}

const sizeSetMappedSize: { [key in Size]: SizeSet } = {
  small: {
    fontSize: '1rem',
    markSize: '0.75rem',
    space: '3px',
  },
  medium: {
    fontSize: '1.25rem',
    markSize: '1rem',
    space: '5px',
  },
  large: {
    fontSize: '1.875rem',
    markSize: '1.5rem',
    space: '7.5px',
  },
};

const CategoryLabel = (prop: Prop) => {
  const { fontSize, markSize, space } =
    sizeSetMappedSize[prop.size ?? 'medium'];

  return (
    <Box
      fontSize={fontSize}
      color={prop.textColor ?? 'inherit'}
      display="flex"
      alignItems="center"
      gap={space}
      width="100%"
    >
      <TrainingMark color={prop.color} size={markSize} />
      {prop.children}
    </Box>
  );
};

export default CategoryLabel;
