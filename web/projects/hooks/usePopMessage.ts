import { useState } from 'react';

interface Option {
  mode?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const DEFAULT_OPTION: Option = {
  mode: 'info',
  duration: 3000,
};

const usePopMessage = () => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState({ ...DEFAULT_OPTION });

  const popMessage = (
    message: string,
    {
      mode = DEFAULT_OPTION.mode,
      duration = DEFAULT_OPTION.duration,
    }: Option = DEFAULT_OPTION
  ) => {
    setMessage(message);
    setOption({ mode, duration });
    setOpen(true);
  };

  const closeMessage = () => {
    setOpen(false);
  };

  return { popMessage, open, option, message, closeMessage };
};

export default usePopMessage;
