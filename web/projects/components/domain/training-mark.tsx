import { Circle } from '@mui/icons-material';

interface TrainingMarkProp {
  color: string;
  size?: string;
}
const TrainingMark = (
  prop: TrainingMarkProp = { size: '1rem', color: 'inherit' }
) => {
  return <Circle sx={{ color: prop.color, fontSize: prop.size ?? "1rem" }}></Circle>;
};

export default TrainingMark;
