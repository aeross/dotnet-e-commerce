import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalogue/fetchProductsAsync',
    async () => {
        try {
            return await agent.Catalogue.getAll();
        } catch (error) {
            console.log(error);
        }
    }
);

export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    'catalogue/fetchProductByIdAsync',
    async (productId) => {
        try {
            return await agent.Catalogue.getById(productId);
        } catch (error) {
            console.log(error);
        }
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
            productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state) => {
            state.status = "idle";
        });

        builder.addCase(fetchProductByIdAsync.pending, (state) => {
            state.status = "pendingFetchProductById";
        });
        builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchProductByIdAsync.rejected, (state) => {
            state.status = "idle";
        })
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalogue);