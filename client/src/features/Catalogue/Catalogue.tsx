import { Product } from "../../app/models/product"
import { useEffect, useState } from 'react'
import ProductList from "./ProductList"

export default function Catalogue() {
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
            <ProductList products={products} />
        </>
    )
}