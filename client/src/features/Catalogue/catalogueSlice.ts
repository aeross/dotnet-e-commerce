import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

const getParams = (productParams: ProductParams) => {
    const params = new URLSearchParams();

    params.append("pageNumber", productParams.pageNumber.toString());
    params.append("pageSize", productParams.pageSize.toString());
    params.append("orderBy", productParams.orderBy);

    if (productParams.searchTerm) params.append("searchTerm", productParams.searchTerm);
    if (productParams.brands) params.append("brands", productParams.brands.toString());
    if (productParams.types) params.append("types", productParams.types.toString());

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalogue/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getParams(thunkAPI.getState().catalogue.productParams);
        return await agent.Catalogue.getAll(params);
    }
);

export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    'catalogue/fetchProductByIdAsync',
    async (productId) => {
        return await agent.Catalogue.getById(productId);
    }
);

export const fetchFilters = createAsyncThunk(
    'catalogue/fetchFilters',
    async () => {
        return await agent.Catalogue.getFilters();
    }
);

// the slice
export interface CatalogueState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    brands: string[];
    types: string[];
    status: string;
    productParams: ProductParams;
}

const initParams = () => ({ orderBy: "name", pageNumber: 1, pageSize: 6 });

export const catalogueSlice = createSlice({
    name: "catalogue",
    initialState: productsAdapter.getInitialState<CatalogueState>({
        productsLoaded: false,
        filtersLoaded: false,
        brands: [],
        types: [],
        status: "idle",
        productParams: initParams()
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload };

        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
    },
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

        builder.addCase(fetchFilters.pending, (state) => {
            state.status = "pendingFetchFilters";
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = "idle";
        });
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalogue);
export const { setProductParams, resetProductParams } = catalogueSlice.actions;