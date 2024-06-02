import { useParams } from 'react-router-dom';
import { Product } from '../../app/models/product';
import { useState, useEffect } from 'react';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import agent from '../../app/api/agent';
import NotFound from '../../app/errors/NotFound';
import Loading from '../../app/layout/Loading';
import { toDollarFormat } from '../../app/utils/money';
import { UseStoreContext } from '../../app/context/StoreContext';
import { LoadingButton } from '@mui/lab';

function ProductDetails() {
    const { cart, setCart, removeItem } = UseStoreContext();

    const params = useParams<{ id: string }>();
    const id = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [loadingQty, setLoadingQty] = useState(false);
    const item = cart?.items.find(i => i.productId == product?.id);

    useEffect(() => {
        (async () => {
            if (item) setQuantity(item.quantity);

            if (id) {
                try {
                    const product = await agent.Catalogue.getById(parseInt(id));
                    setProduct(product);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
            setLoading(false);
        })();
    }, [id, item])

    function handleQtyChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = parseInt(event.target.value);
        if (val >= 0) {
            setQuantity(val);
        }
    }

    async function submitQtyChange() {
        if (!product) return;
        setLoadingQty(true);

        try {
            let cart;
            if (!item) {
                // add item to cart, when there is no item in the cart yet
                cart = await agent.Cart.addItem(product.id, quantity);
                setCart(cart);
            } else if (quantity > item.quantity) {
                // add item to cart, when the specified quantity is larger than the item's quantity in cart
                const updatedQty = quantity - item.quantity;
                cart = await agent.Cart.addItem(product.id, updatedQty);
                setCart(cart);
            } else if (quantity < item.quantity) {
                // remove item from cart, when the specified quantity is smaller than the item's quantity in cart
                const updatedQty = item.quantity - quantity;
                await agent.Cart.removeItem(product.id, updatedQty);
                removeItem(product?.id!, updatedQty);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingQty(false);
        }
    }

    if (loading) return <Loading />
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
                                <TableRow>
                                    <TableCell>Quantity In Stock</TableCell>
                                    <TableCell>{product.quantityInStock}</TableCell>
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
                                loading={loadingQty}
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