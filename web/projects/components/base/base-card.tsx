import { Card, useTheme } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  onClick?: MouseEventHandler;
}

const BaseCard = (prop: Prop) => {
  const theme = useTheme();
  const background = theme.palette.background;

  return (
    <Card
      onClick={prop.onClick}
      variant="outlined"
      sx={{
        background: background.light,
        padding: '10px 20px',
        color: background.contrastText,
      }}
    >
      {prop.children}
    </Card>
  );
};

export default BaseCard;
