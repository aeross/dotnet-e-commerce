import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { toDollarFormat } from "../../app/utils/money";
import { addCartItemAsync } from "../cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

interface Props {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.cart);

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name[0].toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    {toDollarFormat(product.price / 100)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={status.includes("pendingAdd" + product.id + "Item")}
                    onClick={() => dispatch(addCartItemAsync({ productId: product.id }))}
                    size="small"
                >
                    Add to Cart
                </LoadingButton>
                <Button size="small" component={Link} to={`/catalogue/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}