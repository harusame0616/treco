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
    <div className="delete-slide-action">
      <BaseSlideAction
        action={
          <div className="delete-button">
            <PrimaryButton height="100%" onClick={prop.onDeleteClick}>
              <DeleteForeverRounded sx={{ fontSize: '3rem' }} />
            </PrimaryButton>
          </div>
        }
      >
        {prop.children}
      </BaseSlideAction>
    </div>
  );
};
export default DeleteSlideAction;
