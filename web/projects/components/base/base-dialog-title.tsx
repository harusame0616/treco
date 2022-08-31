import { ReportGmailerrorredRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  alert?: boolean;
}

const BaseDialogTitle = (prop: Prop) => {
  return (
    <Box
      marginY="10px"
      sx={{ fontWeight: 'bold' }}
      display="flex"
      alignItems="center"
      gap="5px"
    >
      {prop.alert ? (
        <ReportGmailerrorredRounded color="primary" sx={{ fontSize: '3rem' }} />
      ) : undefined}
      <Box fontSize="'3rem">{prop.children}</Box>
    </Box>
  );
};

export default BaseDialogTitle;
