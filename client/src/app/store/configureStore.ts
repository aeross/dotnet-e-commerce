import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { cartSlice } from "../../features/cart/cartSlice";
import { catalogueSlice } from "../../features/catalogue/catalogueSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        cart: cartSlice.reducer,
        catalogue: catalogueSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;