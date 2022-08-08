import { Icon, IconButton } from '@mui/material';
import { MenuRounded } from '@mui/icons-material';

interface MenuButtonProp {
  color?: string;
}
const MenuButton = (prop: MenuButtonProp) => {
  return (
    <IconButton>
      <MenuRounded sx={{ color: prop.color }} />
    </IconButton>
  );
};

export default MenuButton;
