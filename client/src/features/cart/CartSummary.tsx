import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { UseStoreContext } from "../../app/context/StoreContext";
import { toDollarFormat } from "../../app/utils/money";

export default function CartSummary() {
    const { cart } = UseStoreContext();
    const items = cart?.items;

    const subtotal = items ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
    const deliveryFee = (subtotal > 10000) ? 0 : 500;

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{toDollarFormat(subtotal / 100)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{toDollarFormat(deliveryFee / 100)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{toDollarFormat((subtotal + deliveryFee) / 100)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}