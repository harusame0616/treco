import {
  TrainingMenu,
  TrainingMenuDto,
  TrainingMenuProperty,
} from '@Domains/training-menu/training-menu';
import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import BaseDialog from '../../base/base-dialog';
import BaseDialogTitle from '../../base/base-dialog-title';

interface Prop {
  open: boolean;
  trainingMenu?: TrainingMenuDto;
  onPirmaryClick: (
    data: Omit<TrainingMenuProperty, 'trainingEventIds'>,
    reset: () => void
  ) => Promise<void> | void;
  onSecondaryClick: (
    data: Omit<TrainingMenuProperty, 'trainingEventIds'>,
    reset: () => void
  ) => Promise<void> | void;
  onError: (error: Error) => void;
  isLoading?: boolean;
}

const DEFAULT_NAME = '';
const DEFAULT_NOTE = '';

const TrainingMenuEditPopup = (prop: Prop) => {
  const [name, setName] = useState(prop.trainingMenu?.name ?? DEFAULT_NAME);
  const [note, setNote] = useState(prop.trainingMenu?.note ?? DEFAULT_NOTE);

  const trainingMenu = { name, note };

  const reset = () => {
    setName(prop.trainingMenu?.name ?? DEFAULT_NAME);
    setNote(prop.trainingMenu?.note ?? DEFAULT_NOTE);
  };

  useEffect(() => {
    reset();
  }, [prop.trainingMenu]);

  const createTrainingMenu = () => {
    try {
      TrainingMenu.validateName(name);
      TrainingMenu.validateNote(note);
    } catch (e: any) {
      prop.onError(e);
      return;
    }

    prop.onPirmaryClick(trainingMenu, reset);
  };

  return (
    <BaseDialog
      open={prop.open}
      onSecondaryClick={() => prop.onSecondaryClick(trainingMenu, reset)}
      onPrimaryClick={createTrainingMenu}
      primaryLabel="作成する"
      isLoading={prop.isLoading}
    >
      <BaseDialogTitle>トレーニングメニュー作成</BaseDialogTitle>
      <Box display="flex" flexDirection="column" gap="5px">
        <TextField
          autoFocus
          variant="filled"
          size="small"
          sx={{ background: '#ddd' }}
          value={name}
          label="トレーニングメニュー名"
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={prop.isLoading}
        />
        <TextField
          variant="filled"
          size="small"
          sx={{ background: '#ddd' }}
          value={note}
          label="備考"
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          disabled={prop.isLoading}
        />
      </Box>
    </BaseDialog>
  );
};

export default TrainingMenuEditPopup;
