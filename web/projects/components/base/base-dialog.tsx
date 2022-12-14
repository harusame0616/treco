import { ReportGmailerrorredRounded } from '@mui/icons-material';
import { Box, Dialog } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import PrimaryButton from '../case/primary-button';
import SecondaryButton from '../case/secondary-button';
import BaseCard from './base-card';

interface Prop {
  children: ReactNode;
  title?: ReactNode;
  open?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  primary?: boolean;
  secondary?: boolean;
  onPrimaryClick?: MouseEventHandler;
  onSecondaryClick?: MouseEventHandler;
  onClose?: () => void;
  alert?: boolean;
  isLoading?: boolean;
}

const BaseDialog = (prop: Prop) => {
  return (
    <Dialog open={prop.open ?? false} onClose={prop.onClose} fullWidth>
      <BaseCard>
        <Box marginY="20px" width="100%">
          {prop.children}
        </Box>
        <Box
          marginY="10px"
          display="flex"
          flexDirection="column"
          gap="10px"
          width="100%"
        >
          <SecondaryButton
            onClick={prop.onSecondaryClick}
            disabled={prop.isLoading}
          >
            {prop.secondaryLabel ?? 'キャンセル'}
          </SecondaryButton>
          <PrimaryButton
            onClick={prop.onPrimaryClick}
            isLoading={prop.isLoading}
          >
            {prop.primaryLabel ?? 'ok'}
          </PrimaryButton>
        </Box>
      </BaseCard>
    </Dialog>
  );
};

export default BaseDialog;
