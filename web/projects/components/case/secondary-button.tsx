import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  onClick?: MouseEventHandler;
  disabled?: boolean;
}

const SecondaryButton = (prop: Prop) => {
  return (
    <Button
      variant="outlined"
      sx={{ width: '100%' }}
      color="primary"
      onClick={prop.onClick}
      disabled={prop.disabled}
    >
      {prop.children}
    </Button>
  );
};

export default SecondaryButton;
