import { useEffect, useState } from 'react'
import { Product } from '../models/product';
import Catalogue from '../../features/Catalogue/Catalogue';
import { Typography } from '@mui/material';

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const products = await res.json();
      setProducts(products);
    })();
  }, [])

  return (
    <>
      <Typography variant='h2'>Re-Store</Typography>

      <Catalogue products={products} />


    </>
  )
}

export default App
