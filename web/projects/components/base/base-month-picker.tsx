import { CalendarMonthRounded } from '@mui/icons-material';
import { IconButton, Input } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';

interface Prop {
  month: Dayjs;
  onChange: (month: Dayjs) => void | Promise<void>;
}

const BaseDatePicker = (prop: Prop) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <IconButton
      sx={{ position: 'relative' }}
      onClick={() => {
        inputRef.current?.focus();
        inputRef.current?.click();
      }}
      color={'primary'}
    >
      <CalendarMonthRounded />
      <Input
        inputRef={inputRef}
        type="month"
        value={prop.month.toDate()}
        onInput={(e: any) => {
          prop.onChange(dayjs(e.target.value));
        }}
        sx={{
          width: '20px',
          height: '40px',
          opacity: '0',
          left: '10px',
          top: '7px',
          fontSize: '30px',
          position: 'absolute',
        }}
      />
    </IconButton>
  );
};

export default BaseDatePicker;
