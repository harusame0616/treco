import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface PrimaryButtonProp {
  children: ReactNode;
  onClick: MouseEventHandler;
}

const PrimaryButton = (prop: PrimaryButtonProp) => {
  return (
    <Button
      variant="contained"
      sx={{ width: '100%' }}
      color="primary"
      onClick={prop.onClick}
    >
      {prop.children}
    </Button>
  );
};

export default PrimaryButton;
