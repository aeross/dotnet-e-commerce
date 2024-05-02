import { useState } from 'react';
import Header from './Header';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';

function App() {
  const [dark, setDark] = useState(false);

  const theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      background: {
        default: dark ? '#4a4a4a' : '#eaeaea'
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header dark={dark} setDark={() => { setDark(!dark) }} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
