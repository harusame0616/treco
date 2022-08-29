import { AddRounded } from '@mui/icons-material';
import { IconButton, makeStyles } from '@mui/material';
import { memo, MouseEventHandler } from 'react';

interface Prop {
  onClick: MouseEventHandler;
  disabled: boolean;
}

const AddButton = memo(function _AddButton(prop: Prop) {
  return (
    <IconButton
      sx={{
        background: 'white',
        boxShadow: '1px 1px 4px black',
        '&:hover': { backgroundColor: '#ccc' },
        '&:disabled': { backgroundColor: '#333', opacity: '70%' },
      }}
      onClick={prop.onClick}
      disabled={prop.disabled}
    >
      <AddRounded
        sx={{
          color: 'red',
          fontWeight: 'bold',
          opacity: prop.disabled ? '60%' : '100%',
        }}
      />
    </IconButton>
  );
});

export default AddButton;
