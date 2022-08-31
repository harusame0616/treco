import { Box, Grid } from '@mui/material';
import { ReactNode } from 'react';
import { ActivityWithCategoryAndTrainingEventDto } from '../../contexts/record/usecases/activity-query-usecase';
import BaseCard from '../base/base-card';
import ListContainer from '../container/list-container';
import CategoryLabel from './category-label';

interface ActivityListItemProp {
  activity: ActivityWithCategoryAndTrainingEventDto;
  label?: ReactNode;
  onClick?: (activity: ActivityWithCategoryAndTrainingEventDto) => void;
}

const ActivityListItem = (prop: ActivityListItemProp) => {
  return (
    <Box onClick={() => prop.onClick?.({ ...prop.activity })}>
      {prop.label ?? (
        <Box display="flex" alignItems="center" marginBottom="5px">
          <CategoryLabel color={prop.activity.color} size="small">
            {prop.activity.categoryName}
            &nbsp;-&nbsp;
            {prop.activity.trainingEventName}
          </CategoryLabel>
        </Box>
      )}
      <Box>
        <BaseCard>
          <ListContainer>
            <Grid
              container
              sx={{
                fontSize: '1rem',
              }}
            >
              <Grid container sx={{ fontSize: '0.5rem', color: '#999' }}>
                <Grid item xs={1}></Grid>
                <Grid item xs={2.5} padding="2px">
                  負荷
                </Grid>
                <Grid item xs={2.5} padding="2px">
                  値
                </Grid>
                <Grid item xs={6} padding="2px">
                  備考
                </Grid>
              </Grid>
              {prop.activity.records.map((record, index) => (
                <Grid container key={index}>
                  <Grid
                    item
                    xs={1}
                    padding="2px"
                    sx={{
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingBottom: '3px',
                      color: '#999',
                    }}
                  >
                    {index + 1}
                  </Grid>
                  <Grid
                    item
                    xs={2.5}
                    display="flex"
                    alignItems="flex-end"
                    flexWrap="wrap"
                    padding="2px"
                  >
                    {record.load}
                    <Box
                      sx={{ fontSize: '0.5rem', color: '#999' }}
                      paddingBottom="3px"
                      marginLeft="2.5px"
                    >
                      {prop.activity.loadUnit}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={2.5}
                    display="flex"
                    alignItems="flex-end"
                    flexWrap="wrap"
                    padding="2px"
                  >
                    {record.value}
                    <Box
                      sx={{ fontSize: '0.5rem', color: '#999' }}
                      paddingBottom="3px"
                      marginLeft="2.5px"
                    >
                      {prop.activity.valueUnit}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                  >
                    {record.note?.length ? record.note : '-'}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </ListContainer>
        </BaseCard>
      </Box>
    </Box>
  );
};

export default ActivityListItem;
