import { CloseRounded } from '@mui/icons-material';
import { Box, IconButton, TextField } from '@mui/material';
import { ChangeEventHandler, MouseEventHandler, ReactNode } from 'react';
import { ActivityRecordWork } from '../../hooks/useActivityEdit';
import BaseCard from '../base/base-card';

interface Prop {
  record: ActivityRecordWork;
  loadUnit: string;
  valueUnit: string;
  label: ReactNode;
  loadOnChange: ChangeEventHandler;
  valueOnChange: ChangeEventHandler;
  noteOnChange: ChangeEventHandler;
  onDeleteClick: MouseEventHandler;
  isError?: boolean;
}

const RecordCard = (prop: Prop) => {
  return (
    <BaseCard>
      <Box display="flex" flexDirection="column" gap="5px">
        <Box display="flex" marginTop="-10px" marginBottom="-10px">
          <Box flexGrow={1} display="flex" alignItems="center">
            {prop.label}
          </Box>
          <Box flexGrow={0} marginRight="-12px">
            <IconButton color="primary" onClick={prop.onDeleteClick}>
              <CloseRounded />
            </IconButton>
          </Box>
        </Box>
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
          value={prop.record.note}
          sx={{ background: '#ddd' }}
          onChange={prop.noteOnChange}
          inputProps={{ maxLength: 1024 }}
        />
      </Box>
    </BaseCard>
  );
};

export default RecordCard;
