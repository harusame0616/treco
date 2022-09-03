import { CircularProgress } from '@mui/material';

interface Prop {
  size?: string;
  color?: string;
}

const BaseProgress = (prop: Prop) => {
  return <CircularProgress size={prop.size} sx={{ color: prop.color }} />;
};

export default BaseProgress;
