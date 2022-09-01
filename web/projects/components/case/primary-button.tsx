import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import BaseProgress from '../base/base-progress';

interface PrimaryButtonProp {
  children: ReactNode;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  isLoading?: boolean;
  height?: string;
}

const PrimaryButton = (prop: PrimaryButtonProp) => {
  return (
    <Button
      variant="contained"
      sx={{ width: '100%', height: prop.height }}
      color="primary"
      onClick={prop.onClick}
      disabled={prop.disabled}
    >
      {prop.isLoading ? (
        <BaseProgress size="1.5rem" color="white" />
      ) : (
        prop.children
      )}
    </Button>
  );
};

export default PrimaryButton;
