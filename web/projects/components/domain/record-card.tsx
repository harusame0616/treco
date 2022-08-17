import { Box, TextField } from '@mui/material';
import { ChangeEventHandler, ReactNode } from 'react';
import { Record } from '../../hooks/useActivities';
import BaseCard from '../base/base-card';

interface Prop {
  record: Partial<Record>;
  loadUnit: string;
  valueUnit: string;
  label: ReactNode;
  loadOnChange: ChangeEventHandler;
  valueOnChange: ChangeEventHandler;
  noteOnChange: ChangeEventHandler;
}
const RecordCard = (prop: Prop) => {
  return (
    <BaseCard>
      <Box display="flex" flexDirection="column" gap="10px">
        {prop.label}
        <TextField
          variant="filled"
          size="small"
          sx={{ background: '#ddd' }}
          type="number"
          value={prop.record.load}
          label={`負荷 ( ${prop.loadUnit} )`}
          onChange={prop.loadOnChange}
        />
        <TextField
          variant="filled"
          size="small"
          label={`値 ( ${prop.valueUnit} )`}
          sx={{ background: '#ddd' }}
          type="number"
          onChange={prop.valueOnChange}
        />
        <TextField
          variant="filled"
          size="small"
          label="備考"
          sx={{ background: '#ddd' }}
          onChange={prop.noteOnChange}
        />
      </Box>
    </BaseCard>
  );
};

export default RecordCard;
