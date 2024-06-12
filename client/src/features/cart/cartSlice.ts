import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart } from "../../app/models/cart";
import agent from "../../app/api/agent";

export interface cartState {
    cart: Cart | null;
    status: string;
}

const initialState: cartState = {
    cart: null,
    status: 'idle'
}


// centralising our API requests here
export const addCartItemAsync = createAsyncThunk<Cart, { productId: number, qty?: number }>(
    "cart/addItemAsync",
    async ({ productId, qty = 1 }, thunkAPI) => {
        try {
            return await agent.Cart.addItem(productId, qty);
        } catch (error: unknown) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            } else if (error instanceof Error) {
                return thunkAPI.rejectWithValue({ error: error.message });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
        }
    }
);

export const removeCartItemAsync = createAsyncThunk<void, { productId: number, qty?: number, name?: string }>(
    "cart/removeItemAsync",
    async ({ productId, qty = 1 }, thunkAPI) => {
        try {
            await agent.Cart.removeItem(productId, qty);
        } catch (error: unknown) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            } else if (error instanceof Error) {
                return thunkAPI.rejectWithValue({ error: error.message });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
        }
    }
);

// slice
export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        }
    },
    extraReducers: (builder) => {
        // when fetching is on progress...
        builder.addCase(addCartItemAsync.pending, (state, action) => {
            state.status = "pendingAdd" + action.meta.arg.productId + "Item";
        });

        // when the request returns ok
        builder.addCase(addCartItemAsync.fulfilled, (state, action) => {
            if (action.payload) state.cart = action.payload;
            state.status = "idle";
        });

        // when the request returns an error
        builder.addCase(addCartItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = "idle";
        });

        builder.addCase(removeCartItemAsync.pending, (state, action) => {
            const name = action.meta.arg.name ?? "";
            state.status = "pendingRemove" + action.meta.arg.productId + name + "Item";
        });
        builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
            // the API to remove item does not return the new cart with the item removed.
            // that's why we need to do this... (remove the item from the cart state itself)
            if (!state.cart) return;

            const { productId, qty = 1 } = action.meta.arg;

            const itemIndex = state.cart.items.findIndex(i => i.productId === productId);

            if (itemIndex >= 0) {
                state.cart.items[itemIndex].quantity -= qty;
                if (state.cart.items[itemIndex].quantity <= 0) {
                    state.cart.items.splice(itemIndex, 1);
                }
            }

            state.status = "idle";
        });
        builder.addCase(removeCartItemAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = "idle";
        });
    }
});

export const { setCart } = cartSlice.actions;