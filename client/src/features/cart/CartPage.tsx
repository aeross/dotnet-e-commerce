import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { UseStoreContext } from "../../app/context/StoreContext";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";

function CartPage() {
    const { cart, setCart, removeItem } = UseStoreContext();
    const [status, setStatus] = useState({
        name: "",
        loading: false
    });

    async function handleAddItem(name: string, productId: number, quantity = 1) {
        try {
            setStatus({ name, loading: true });
            const cart = await agent.Cart.addItem(productId, quantity);
            setCart(cart);
        } catch (error) {
            console.log(error);
        } finally {
            setStatus({ name: "", loading: false });
        }
    }

    async function handleRemoveItem(name: string, productId: number, quantity = 1) {
        try {
            setStatus({ name, loading: true });

            // remove item does not return the new cart with the item removed.
            await agent.Cart.removeItem(productId, quantity);

            // that's why we need to do this... (remove the item from the cart state itself)
            removeItem(productId, quantity);
        } catch (error) {
            console.log(error);
        } finally {
            setStatus({ name: "", loading: false });
        }
    }

    if (!cart) return <Typography variant="h3">Your cart is empty</Typography>

    return (
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
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton
                                    loading={status.name === `remove${item.productId}` && status.loading}
                                    onClick={() => handleRemoveItem(`remove${item.productId}`, item.productId)}
                                    color="error"
                                >
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={status.name === `add${item.productId}` && status.loading}
                                    onClick={() => handleAddItem(`add${item.productId}`, item.productId)}
                                    color="secondary"
                                >
                                    <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status.name === `delete${item.productId}` && status.loading}
                                    onClick={() => handleRemoveItem(`delete${item.productId}`, item.productId, item.quantity)}
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
    )
}

export default CartPage