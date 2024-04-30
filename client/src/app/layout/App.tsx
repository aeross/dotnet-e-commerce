import { useState } from 'react';
import Catalogue from '../../features/Catalogue/Catalogue';
import Header from './Header';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';

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
        <Catalogue />
      </Container>
    </ThemeProvider>
  )
}

export default App
