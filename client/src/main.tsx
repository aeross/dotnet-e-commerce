import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/layout/styles.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/Routes'
import { Provider } from 'react-redux'
import { store } from './app/store/configureStore'
import { fetchProductsAsync } from './features/catalogue/catalogueSlice'

store.dispatch(fetchProductsAsync());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
