import { AddRounded } from '@mui/icons-material';
import { IconButton, makeStyles } from '@mui/material';
import { memo, MouseEventHandler } from 'react';

interface Prop {
  onClick: MouseEventHandler;
}

const AddButton = memo(function _AddButton(prop: Prop) {
  return (
    <IconButton
      sx={{
        background: 'white',
        boxShadow: '1px 1px 4px black',
        '&:hover': { backgroundColor: '#ccc' },
      }}
      onClick={prop.onClick}
    >
      <AddRounded sx={{ color: 'red', fontWeight: 'bold' }} />
    </IconButton>
  );
});

export default AddButton;
