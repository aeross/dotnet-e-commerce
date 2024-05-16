import { Product } from "../../app/models/product"
import { useEffect, useState } from 'react'
import ProductList from "../catalogue/ProductList"
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";

export default function Catalogue() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const products = await agent.Catalogue.getAll();
            setProducts(products);
            setLoading(false);
        })();
    }, [])

    if (loading) return <Loading />
    return (
        <>
            <ProductList products={products} />
        </>
    )
}