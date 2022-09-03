import { MenuRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface MenuButtonProp {
  color?: string;
  onClick?: () => void;
}
const MenuButton = (prop: MenuButtonProp) => {
  return (
    <IconButton onClick={prop.onClick}>
      <MenuRounded sx={{ color: prop.color }} />
    </IconButton>
  );
};

export default MenuButton;
