import { List } from "@mui/material"
import { Product } from "../../app/models/product"
import ProductCard from "./ProductCard"

interface Props {
    products: Product[]
}

export default function ProductList({ products }: Props) {
    return (
        <List>
            {
                products.map(p => {
                    return (
                        <ProductCard product={p} key={p.id} />
                    )
                })
            }
        </List>
    )
}