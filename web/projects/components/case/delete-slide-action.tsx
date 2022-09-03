import { DeleteForeverRounded } from '@mui/icons-material';
import { MouseEventHandler, ReactNode } from 'react';
import BaseSlideAction from '../base/base-slide-action';
import PrimaryButton from './primary-button';

interface Prop {
  children: ReactNode;
  onDeleteClick: MouseEventHandler;
}

const DeleteSlideAction = (prop: Prop) => {
  return (
    <BaseSlideAction
      action={
        <PrimaryButton height="100%" onClick={prop.onDeleteClick}>
          <DeleteForeverRounded sx={{ fontSize: '3rem' }} />
        </PrimaryButton>
      }
    >
      {prop.children}
    </BaseSlideAction>
  );
};
export default DeleteSlideAction;
