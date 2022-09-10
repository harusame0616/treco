import { MouseEventHandler } from 'react';
import BaseDialog from '../base/base-dialog';
import BaseDialogTitle from '../base/base-dialog-title';

interface Prop {
  open: boolean;
  onPrimaryClick: MouseEventHandler;
  onSecondaryClick: MouseEventHandler;
  isLoading?: boolean;
}

const DeleteConfirmDialog = (prop: Prop) => {
  return (
    <BaseDialog {...prop}>
      <BaseDialogTitle alert>削除しますか？</BaseDialogTitle>
    </BaseDialog>
  );
};

export default DeleteConfirmDialog;
