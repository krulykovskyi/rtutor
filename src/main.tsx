import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { PaletteMode } from '@mui/material/styles';

const MyThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  const settingValue = state.data.settings.find(
    (setting) => setting.name === 'theme',
  )?.value;

  // Перевірка та приведення типу
  const mode: PaletteMode =
    settingValue === 'light' || settingValue === 'dark'
      ? settingValue
      : 'light';

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <AppProvider>
    <MyThemeProvider>
      <App />
    </MyThemeProvider>
  </AppProvider>,
  // </React.StrictMode>
);
