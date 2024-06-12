import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";

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
            const user = await agent.Account.login(data);
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error: unknown) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
        }
    }
)

export const fetchCurrUser = createAsyncThunk<User>(
    "account/fetchCurrUser",
    async (_, thunkAPI) => {
        try {
            const user = await agent.Account.currUser();
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error) {
            if (error instanceof Response) {
                return thunkAPI.rejectWithValue({ error: error.status + " " + error.statusText });
            }
            return thunkAPI.rejectWithValue({ error: "An error has occured" });
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
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(loginUser.fulfilled, fetchCurrUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });

        builder.addMatcher(isAnyOf(loginUser.rejected, fetchCurrUser.rejected), (_state, action) => {
            console.log(action.payload);
        });
    })
})

export const { logOut } = accountSlice.actions;