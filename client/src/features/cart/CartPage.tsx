import { useEffect, useState } from "react"
import { Cart } from "../../app/models/cart";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

function CartPage() {
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<Cart | null>(null);

    useEffect(() => {
        (async () => {
            const cart = await agent.Cart.get();
            setCart(cart);
            setLoading(false);
        })();
    }, [])

    if (loading) return <Loading />

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
                                {item.name}
                            </TableCell>
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">{item.quanity}</TableCell>
                            <TableCell align="right">${(item.price * item.quanity / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <IconButton color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CartPage