import { useEffect } from 'react'
import ProductList from "../catalogue/ProductList"
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogueSlice";
import { FormLabel, Grid, Paper } from '@mui/material';
import ProductSearch from './ProductSearch';
import { ProductSortOptions } from '../../app/models/product';
import RadioButtonGroup from '../../app/components/RadioButtonGroup';
import CheckboxButtonGroup from '../../app/components/CheckboxButtonGroup';
import AppPagination from '../../app/components/AppPagination';

const sortOptions: ProductSortOptions[] = [
    { value: "name", label: "Alphabetical" },
    { value: "priceAsc", label: "Price - Low to High" },
    { value: "priceDesc", label: "Price - High to Low" }
]

export default function Catalogue() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalogue);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch])


    if (!filtersLoaded) return <Loading />

    return (
        <Grid container columnSpacing={4} sx={{ mb: 2 }}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormLabel>Sort by</FormLabel>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        // whenever the filter changes, reset pagination's current page back to 1
                        onChange={(event: any) => dispatch(setProductParams({ orderBy: event.target.value, pageNumber: 1 }))}
                    />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormLabel>Filter by brand</FormLabel>
                    <CheckboxButtonGroup
                        items={brands}
                        checked={productParams.brands}
                        // whenever the filter changes, reset pagination's current page back to 1
                        onChange={(items: string[]) => dispatch(setProductParams({ brands: items, pageNumber: 1 }))}
                    />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormLabel>Filter by type</FormLabel>
                    <CheckboxButtonGroup
                        items={types}
                        checked={productParams.types}
                        // whenever the filter changes, reset pagination's current page back to 1
                        onChange={(items: string[]) => dispatch(setProductParams({ types: items, pageNumber: 1 }))}
                    />
                </Paper>
            </Grid>

            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>

            <Grid item xs={3} />

            <Grid item xs={9}>
                <AppPagination
                    metaData={metaData}
                    onPageChange={(page: number) => {
                        return dispatch(setProductParams({ pageNumber: page }));
                    }}
                />
            </Grid>
        </Grid>
    )
}