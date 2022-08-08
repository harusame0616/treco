import { createTheme } from '@mui/material';

interface UseThemeProp {
  theme: 'dark';
}
const useMyTheme = (prop: UseThemeProp) => {
  const themes = {
    dark: {
      palette: {
        primary: {
          light: '#f04040',
          main: '#e02020',
          dark: '#c00000',
          contrastText: '#fff',
        },
        secondary: {
          light: '#de63ff',
          main: '#be43e0',
          dark: '#9e23c0',
          contrastText: '#fff',
        },
        background: {
          dark: '#000000',
          default: '#131313',
          paper: '#000000',
          contrastText: '#fff',
        },
      },
    },
  };

  return createTheme(themes[prop.theme]);
};
export default useMyTheme;
