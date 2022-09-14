import { Box, TextField } from '@mui/material';
import { ChangeEventHandler, ReactNode } from 'react';
import { ActivityRecordWork } from '@Hooks/activity/useActivityEdit';
import BaseCard from '@Components/base/base-card';

interface Prop {
  record: ActivityRecordWork;
  loadUnit: string;
  valueUnit: string;
  label: ReactNode;
  loadOnChange: ChangeEventHandler;
  valueOnChange: ChangeEventHandler;
  noteOnChange: ChangeEventHandler;
  isError?: boolean;
  isDisabled?: boolean;
}

const RecordCard = (prop: Prop) => {
  let rm =
    parseInt(prop.record.load + '') *
    (1 + parseInt(prop.record.value + '') / 40);

  const rmString =
    Number.isNaN(rm) || rm < 0 ? '-' : Math.floor(rm * 100) / 100 + '';
  return (
    <BaseCard>
      <Box display="flex" flexDirection="column" gap="5px">
        <Box display="flex">
          <Box flexGrow={1} display="flex" alignItems="center">
            {prop.label}{' '}
          </Box>
          <Box fontSize="0.85em" display="flex" alignItems="center">
            RM: {rmString}
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
          disabled={prop.isDisabled}
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
          disabled={prop.isDisabled}
        />
        <TextField
          variant="filled"
          size="small"
          label="備考"
          value={prop.record.note}
          sx={{ background: '#ddd' }}
          onChange={prop.noteOnChange}
          inputProps={{ maxLength: 1024 }}
          disabled={prop.isDisabled}
        />
      </Box>
    </BaseCard>
  );
};

export default RecordCard;
