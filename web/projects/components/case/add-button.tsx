import { AddRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { MouseEventHandler } from 'react';

interface Prop {
  onClick: MouseEventHandler;
}

const AddButton = (prop: Prop) => {
  return (
    <IconButton sx={{ background: 'white' }} onClick={prop.onClick}>
      <AddRounded sx={{ color: 'red', fontWeight: 'bold' }} />
    </IconButton>
  );
};

export default AddButton;
