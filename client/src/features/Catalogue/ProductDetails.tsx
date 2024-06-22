import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import NotFound from '../../app/errors/NotFound';
import Loading from '../../app/layout/Loading';
import { toDollarFormat } from '../../app/utils/money';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { addCartItemAsync, removeCartItemAsync } from '../cart/cartSlice';
import { fetchProductByIdAsync, productSelectors } from './catalogueSlice';

function ProductDetails() {
    const dispatch = useAppDispatch();
    const { cart, status } = useAppSelector(state => state.cart);
    const { status: productStatus } = useAppSelector(state => state.catalogue);

    const params = useParams<{ id: string }>();
    const id = params.id ?? "";

    const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id)));
    const [quantity, setQuantity] = useState(0);
    const item = cart?.items.find(i => i.productId == product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if (!product) dispatch(fetchProductByIdAsync(parseInt(id)));
    }, [id, item, dispatch, product])

    function handleQtyChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = parseInt(event.target.value);
        if (val >= 0) {
            setQuantity(val);
        }
    }

    async function submitQtyChange() {
        if (!product) return;

        try {
            if (!item) {
                // add item to cart, when there is no item in the cart yet
                dispatch(addCartItemAsync({ productId: product?.id!, qty: quantity }));
            } else if (quantity > item.quantity) {
                // add item to cart, when the specified quantity is larger than the item's quantity in cart
                const updatedQty = quantity - item.quantity;
                dispatch(addCartItemAsync({ productId: product?.id!, qty: updatedQty }));
            } else if (quantity < item.quantity) {
                // remove item from cart, when the specified quantity is smaller than the item's quantity in cart
                const updatedQty = item.quantity - quantity;
                dispatch(removeCartItemAsync({ productId: product?.id!, qty: updatedQty }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (productStatus.includes("pending")) return <Loading />
    if (!product) return <NotFound />

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <img src={product.pictureUrl} alt={product.name} style={{ width: "100%" }} />
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h3">{product.name}</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h4" color="secondary">{toDollarFormat(product.price / 100)}</Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>{product.type}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                onChange={handleQtyChange}
                                variant='outlined'
                                type='number'
                                label='Quantity in Cart'
                                fullWidth
                                value={quantity}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LoadingButton
                                disabled={quantity === item?.quantity || (!item && quantity === 0)}
                                loading={status.includes("pending")}
                                onClick={submitQtyChange}
                                sx={{ height: '55px' }}
                                color='primary'
                                size='large'
                                variant='contained'
                                fullWidth
                            >
                                {item ? 'Update Quantity' : 'Add to Cart'}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default ProductDetails