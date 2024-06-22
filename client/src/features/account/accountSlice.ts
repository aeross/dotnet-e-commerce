import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setCart } from "../cart/cartSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const loginUser = createAsyncThunk<User, FieldValues>(
    "account/loginUser",
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const { cart, ...user } = userDto;
            console.log(cart);

            if (cart) thunkAPI.dispatch(setCart(cart));
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error: unknown) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            } else if (error instanceof Error) {
                return thunkAPI.rejectWithValue({ error: error.message });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
        }
    }
)

export const fetchCurrUser = createAsyncThunk<User>(
    "account/fetchCurrUser",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
        try {
            const userDto = await agent.Account.currUser();
            const { cart, ...user } = userDto;
            if (cart) thunkAPI.dispatch(setCart(cart));
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            } else if (error instanceof Error) {
                return thunkAPI.rejectWithValue({ error: error.message });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
        }
    }, {
    condition: () => {
        if (!localStorage.getItem("user")) return false;
    }
}
)

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            router.navigate("/");
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem("user");
            toast.error("Session expired or invalid token, please login again");
            router.navigate("/login");
        });

        builder.addMatcher(isAnyOf(loginUser.fulfilled, fetchCurrUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });

        builder.addMatcher(isAnyOf(loginUser.rejected, fetchCurrUser.rejected), (_state, action) => {
            console.log(action.payload);
        });
    })
})

export const { logOut, setUser } = accountSlice.actions;