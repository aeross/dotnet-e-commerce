import { useEffect, useState } from 'react';
import Header from './Header';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/ReactToastify.css";
import { UseStoreContext } from '../context/StoreContext';
import { getCookie } from '../utils/cookie';
import agent from '../api/agent';
import Loading from './Loading';

function App() {
  const [dark, setDark] = useState(false);

  const { setCart } = UseStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");

    if (buyerId) {
      (async () => {
        try {
          const cart = await agent.Cart.get();
          setCart(cart);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [setCart])

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
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header dark={dark} setDark={() => { setDark(!dark) }} />

      {
        loading ? <Loading /> :
          <Container>
            <Outlet />
          </Container>
      }

    </ThemeProvider>
  )
}

export default App
