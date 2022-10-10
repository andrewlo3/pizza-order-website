import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import './App.css';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#3C2320',
    },
    secondary: {
      main: '#D09150',
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      {isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </ThemeProvider>
  );
};

export default App;
