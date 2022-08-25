import { Box, TextField } from '@mui/material';
import { ChangeEventHandler, ReactNode } from 'react';
import { ActivityRecordWork } from '../../hooks/useActivityCreate';
import BaseCard from '../base/base-card';

interface Prop {
  record: ActivityRecordWork;
  loadUnit: string;
  valueUnit: string;
  label: ReactNode;
  loadOnChange: ChangeEventHandler;
  valueOnChange: ChangeEventHandler;
  noteOnChange: ChangeEventHandler;
  isError?: boolean;
}

const RecordCard = (prop: Prop) => {
  return (
    <BaseCard>
      <Box display="flex" flexDirection="column" gap="5px">
        {prop.label}
        <TextField
          variant="filled"
          size="small"
          sx={{ background: '#ddd' }}
          type="number"
          value={prop.record.load}
          label={`負荷 ( ${prop.loadUnit} )`}
          onChange={prop.loadOnChange}
          error={prop.isError && prop.record.load == ''}
        />
        <TextField
          variant="filled"
          size="small"
          label={`値 ( ${prop.valueUnit} )`}
          sx={{ background: '#ddd' }}
          value={prop.record.value}
          type="number"
          onChange={prop.valueOnChange}
          error={prop.isError && prop.record.value == ''}
        />
        <TextField
          variant="filled"
          size="small"
          label="備考"
          sx={{ background: '#ddd' }}
          onChange={prop.noteOnChange}
          inputProps={{ maxLength: 1024 }}
        />
      </Box>
    </BaseCard>
  );
};

export default RecordCard;
