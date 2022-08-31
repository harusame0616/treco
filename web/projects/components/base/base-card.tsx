import { Card, useTheme } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  onClick?: MouseEventHandler;
  width?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
}

const BaseCard = (prop: Prop) => {
  const theme = useTheme();
  const background = theme.palette.background;

  return (
    <Card
      onClick={prop.onClick}
      variant="outlined"
      sx={{
        background: (background as any).light,
        padding: '10px 20px',
        color: (background as any).contrastText,
        width: prop.width,
        maxWidth: prop.maxWidth,
        height: prop.height,
        minHeight: prop.minHeight,
      }}
    >
      {prop.children}
    </Card>
  );
};

export default BaseCard;
