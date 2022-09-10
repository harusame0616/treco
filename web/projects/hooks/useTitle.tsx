import { MouseEventHandler, ReactElement, useCallback, useState } from 'react';

const useTitle = () => {
  const [title, setTitle] = useState<ReactElement | string>('');
  const [clickListener, _setClickListener] = useState<MouseEventHandler>(
    (e) => {}
  );

  const setClickListener = useCallback(
    (f: MouseEventHandler) => _setClickListener(() => f),
    []
  );

  return {
    title,
    setTitle,
    clickListener,
    setClickListener,
    clear() {
      setTitle('');
    },
  };
};
export default useTitle;
