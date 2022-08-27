import { ReactElement, useState } from 'react';

const useTitle = () => {
  const [title, setTitle] = useState<ReactElement | string>('');

  return {
    title,
    setTitle,
  };
};
export default useTitle;
