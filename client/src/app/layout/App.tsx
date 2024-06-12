import { useCallback, useEffect, useState } from 'react';
import Header from './Header';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/ReactToastify.css";
import Loading from './Loading';
import { fetchCartAsync } from '../../features/cart/cartSlice';
import { useAppDispatch } from '../store/configureStore';
import { fetchCurrUser } from '../../features/account/accountSlice';

function App() {
  const [dark, setDark] = useState(false);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    await dispatch(fetchCurrUser());
    await dispatch(fetchCartAsync());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        await initApp();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [initApp])

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
