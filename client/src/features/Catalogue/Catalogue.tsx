import { useEffect } from 'react'
import ProductList from "../catalogue/ProductList"
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogueSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import ProductSearch from './ProductSearch';
import { ProductSortOptions } from '../../app/models/product';
import RadioButtonGroup from '../../app/components/RadioButtonGroup';

const sortOptions: ProductSortOptions[] = [
    { value: "name", label: "Alphabetical" },
    { value: "priceAsc", label: "Price - Low to High" },
    { value: "priceDesc", label: "Price - High to Low" }
]

export default function Catalogue() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status, filtersLoaded, brands, types, productParams } = useAppSelector(state => state.catalogue);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch])

    if (status.includes("pending")) return <Loading />
    return (
        <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(event: any) => dispatch(setProductParams({ orderBy: event.target.value }))}
                    />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormLabel>Filter by brand</FormLabel>
                    <FormGroup>
                        {brands.map((brand, i) => (
                            <FormControlLabel control={<Checkbox />} label={brand} key={i} />
                        ))}
                    </FormGroup>
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormLabel>Filter by type</FormLabel>
                    <FormGroup>
                        {types.map((type, i) => (
                            <FormControlLabel control={<Checkbox />} label={type} key={i} />
                        ))}
                    </FormGroup>
                </Paper>
            </Grid>

            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>

            <Grid item xs={3} />

            <Grid item xs={9}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>
                        Displaying 1-6 out of 20 items
                    </Typography>
                    <Pagination
                        color="secondary"
                        size="large"
                        count={10}
                        page={2}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}