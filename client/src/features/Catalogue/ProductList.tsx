import { Grid } from "@mui/material"
import { Product } from "../../app/models/product"
import ProductCard from "../catalogue/ProductCard"
import { useAppSelector } from "../../app/store/configureStore"
import ProductCardSkeleton from "./ProductCardSkeleton"

interface Props {
    products: Product[]
}

export default function ProductList({ products }: Props) {
    const { productsLoaded } = useAppSelector(state => state.catalogue);

    return (
        <Grid container spacing={4}>
            {
                products.map(p => {
                    return (
                        <Grid item xs={4} key={p.id}>
                            {!productsLoaded ? (
                                <ProductCardSkeleton />
                            ) : (
                                <ProductCard product={p} />
                            )}
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}