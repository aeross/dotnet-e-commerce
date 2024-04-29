import { Product } from "../../app/models/product"
import ProductList from "./ProductList"

export default function Catalogue({ products }: { products: Product[] }) {
    return (
        <>
            <ProductList products={products} />
        </>
    )
}