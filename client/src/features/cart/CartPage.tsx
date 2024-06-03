import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import CartSummary from "./CartSummary";
import { toDollarFormat } from "../../app/utils/money";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addCartItemAsync, removeCartItemAsync } from "./cartSlice";

function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, status } = useAppSelector(state => state.cart);

    console.log(cart);

    if (!cart || cart.items.length === 0) return <Typography variant="h3">Your cart is empty</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.items.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                        <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{toDollarFormat(item.price / 100)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton
                                        loading={status.includes("pendingRemove" + item.productId + "Item")}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId }))}
                                        color="error"
                                    >
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton
                                        loading={status.includes("pendingAdd" + item.productId + "Item")}
                                        onClick={() => dispatch(addCartItemAsync({ productId: item.productId }))}
                                        color="secondary"
                                    >
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton
                                        loading={status.includes("pendingRemove" + item.productId + "Item")}
                                        onClick={() => dispatch(removeCartItemAsync({ productId: item.productId, qty: item.quantity }))}
                                        color="error"
                                    >
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <CartSummary />
                    <Button
                        component={Link}
                        to="/checkout"
                        variant="contained"
                        size="large"
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default CartPage