import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface TextButtonProp {
  children: ReactNode;
  onClick: MouseEventHandler;
}

const TextButton = (prop: TextButtonProp) => {
  return (
    <Button variant="text" onClick={prop.onClick}>
      {prop.children}
    </Button>
  );
};

export default TextButton;
