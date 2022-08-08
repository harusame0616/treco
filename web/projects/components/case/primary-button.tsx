import { Button } from '@mui/material';
import { ReactNode } from 'react';

interface PrimaryButtonProp {
  children: ReactNode;
}

const PrimaryButton = (prop: PrimaryButtonProp) => {
  return (
    <Button variant="contained" sx={{ width: '100%' }} color="primary">
      {prop.children}
    </Button>
  );
};

export default PrimaryButton;
