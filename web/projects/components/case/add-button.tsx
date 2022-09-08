import BaseCircleButton from '@Components/base/base-circle-button';
import { AddRounded } from '@mui/icons-material';
import { memo, MouseEventHandler } from 'react';

interface Prop {
  onClick: MouseEventHandler;
  disabled?: boolean;
}

const AddButton = memo(function _AddButton(prop: Prop) {
  return (
    <BaseCircleButton onClick={prop.onClick} disabled={prop.disabled}>
      <AddRounded />
    </BaseCircleButton>
  );
});

export default AddButton;
