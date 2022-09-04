import { useState } from 'react';

const useProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcessing = async (promise: () => Promise<any>) => {
    setIsProcessing(true);
    try {
      await promise();
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, startProcessing };
};

export default useProcessing;
