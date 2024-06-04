import { useEffect } from 'react'
import ProductList from "../catalogue/ProductList"
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogueSlice";

export default function Catalogue() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status } = useAppSelector(state => state.catalogue);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    if (status.includes("pending")) return <Loading />
    return (
        <>
            <ProductList products={products} />
        </>
    )
}