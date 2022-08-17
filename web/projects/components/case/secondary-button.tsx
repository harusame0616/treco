import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  onClick: MouseEventHandler;
}

const SecondaryButton = (prop: Prop) => {
  return (
    <Button
      variant="outlined"
      sx={{ width: '100%' }}
      color="primary"
      onClick={prop.onClick}
    >
      {prop.children}
    </Button>
  );
};

export default SecondaryButton;
