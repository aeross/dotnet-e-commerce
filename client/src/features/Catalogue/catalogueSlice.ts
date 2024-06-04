import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalogue/fetchProductsAsync',
    async () => {
        return await agent.Catalogue.getAll();
    }
);

export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    'catalogue/fetchProductByIdAsync',
    async (productId) => {
        return await agent.Catalogue.getById(productId);
    }
);

export const catalogueSlice = createSlice({
    name: "catalogue",
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: "idle"
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts";
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            if (action.payload) productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true;
        });

        builder.addCase(fetchProductByIdAsync.pending, (state) => {
            state.status = "pendingFetchProductById";
        });
        builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
            if (action.payload) productsAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        });
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalogue);