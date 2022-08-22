import { CloseRounded, LogoutRounded } from '@mui/icons-material';
import { Box, Drawer, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import BaseCard from '../../base/base-card';
import TextButton from '../../case/text-button';

interface Prop {
  open: boolean;
  onClose: () => void;
}

const UserMenu = (prop: Prop) => {
  const router = useRouter();

  const logout = () => {
    prop.onClose();
    router.push('/logout');
  };

  return (
    <Drawer anchor="right" open={prop.open} onClose={prop.onClose}>
      <BaseCard height="100%" width="80vw" maxWidth="280px">
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Box display="flex">
            <IconButton onClick={prop.onClose}>
              <CloseRounded sx={{ color: 'white', fontWeight: 'bold' }} />
            </IconButton>
          </Box>
          <Box>
            <TextButton onClick={logout}>
              <LogoutRounded />
              ログアウト
            </TextButton>
          </Box>
        </Box>
      </BaseCard>
    </Drawer>
  );
};

export default UserMenu;
