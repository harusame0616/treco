import { Box } from '@mui/material';
import BaseProgress from '../base/base-progress';

const CenteredProgress = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <BaseProgress />
    </Box>
  );
};

export default CenteredProgress;
