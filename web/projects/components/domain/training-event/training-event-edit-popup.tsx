import { Box, Dialog, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TrainingEventDto } from '../../../contexts/record/domains/training-event/training-event';
import BaseCard from '../../base/base-card';
import PrimaryButton from '../../case/primary-button';
import SecondaryButton from '../../case/secondary-button';
import SectionContainer from '../../container/section-container';

export type TrainingEventEditInfo = Omit<
  TrainingEventDto,
  'userId' | 'categoryId' | 'trainingEventId' | 'order'
>;

interface Prop {
  open: boolean;
  onPirmaryClick: (
    data: TrainingEventEditInfo,
    reset: () => void
  ) => Promise<void> | void;
  onSecondaryClick: (
    data: TrainingEventEditInfo,
    reset: () => void
  ) => Promise<void> | void;
  onError: (e: Error) => Promise<void> | void;
  default?: TrainingEventEditInfo;
  isLoading?: boolean;
}

const DEFAULT_LOAD_UNIT = '';
const DEFAULT_VALUE_UNIT = '';
const DEFAULT_TRAINING_EVENT_NAME = '';

const TrainingEventEditPopup = (prop: Prop) => {
  const [loadUnit, setLoadUnit] = useState(
    prop.default?.loadUnit ?? DEFAULT_LOAD_UNIT
  );
  const [valueUnit, setValueUnit] = useState(
    prop.default?.valueUnit ?? DEFAULT_VALUE_UNIT
  );
  const [trainingEventName, setTrainingEventName] = useState(
    prop.default?.trainingEventName ?? DEFAULT_TRAINING_EVENT_NAME
  );

  const trainingEvent = { trainingEventName, loadUnit, valueUnit };

  const reset = () => {
    setTrainingEventName(
      prop.default?.trainingEventName ?? DEFAULT_TRAINING_EVENT_NAME
    );
    setLoadUnit(prop.default?.loadUnit ?? DEFAULT_LOAD_UNIT);
    setValueUnit(prop.default?.valueUnit ?? DEFAULT_VALUE_UNIT);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prop.default]);

  return (
    <Dialog open={prop.open}>
      <BaseCard width="480px" maxWidth="80vw">
        <Box>トレーニング種目</Box>
        <SectionContainer>
          <Box display="flex" flexDirection="column">
            <SectionContainer>
              <TextField
                autoFocus
                variant="filled"
                size="small"
                sx={{ background: '#ddd' }}
                value={trainingEventName}
                label="トレーニング種目名"
                onChange={(e) => setTrainingEventName(e.target.value)}
                fullWidth
                disabled={prop.isLoading}
              />
            </SectionContainer>
            <Box display="flex" flexDirection="column">
              <TextField
                variant="filled"
                size="small"
                sx={{ background: '#ddd', marginBottom: '3px' }}
                value={loadUnit}
                label="負荷の単位(例:kg)"
                onChange={(e) => setLoadUnit(e.target.value)}
                disabled={prop.isLoading}
              />
              <TextField
                variant="filled"
                size="small"
                sx={{ background: '#ddd' }}
                value={valueUnit}
                label="値の単位(例:回)"
                onChange={(e) => setValueUnit(e.target.value)}
                disabled={prop.isLoading}
              />
            </Box>
          </Box>
        </SectionContainer>
        <SectionContainer>
          <Box display="flex" flexDirection="column" gap="10px">
            <SecondaryButton
              onClick={() => prop.onSecondaryClick(trainingEvent, reset)}
              disabled={prop.isLoading}
            >
              破棄する
            </SecondaryButton>
            <PrimaryButton
              onClick={() => prop.onPirmaryClick(trainingEvent, reset)}
              disabled={prop.isLoading}
              isLoading={prop.isLoading}
            >
              作成する
            </PrimaryButton>
          </Box>
        </SectionContainer>
      </BaseCard>
    </Dialog>
  );
};

export default TrainingEventEditPopup;
