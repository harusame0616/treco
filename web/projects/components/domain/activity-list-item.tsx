import { Box } from '@mui/material';
import { Activity } from '../../hooks/useActivities';
import TrainingMark from './training-mark';

interface ActivityListItemProp {
  activity: Activity;
}

const ActivityListItem = ({ activity }: ActivityListItemProp) => {
  return (
    <Box>
      <Box>
        <Box display="flex" alignItems="center">
          <TrainingMark color={activity.color} />
          <Box marginLeft="5px" fontSize="0.8rem">
            {activity.categoryName}
          </Box>
        </Box>
        <Box marginLeft="20px">{activity.eventName}</Box>
      </Box>
      <Box>
        {activity.records.map((record, index) => (
          <Box display="flex" gap="10px" paddingLeft="40px" key={index}>
            <div>
              {record.value} {activity.valueUnit}
            </div>
            /
            <div>
              {record.load} {activity.loadUnit}
            </div>
            <div>{record.note}</div>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ActivityListItem;
