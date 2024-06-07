import { debounce, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore'
import { setProductParams } from './catalogueSlice';
import { useState } from 'react';

function ProductSearch() {
    const { productParams } = useAppSelector(state => state.catalogue);
    const dispatch = useAppDispatch();

    const [searchInput, setSearchInput] = useState(productParams.searchTerm);
    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({ searchTerm: event.target.value }))
    }, 1000)
    return (
        <TextField
            label='search products'
            variant='outlined'
            fullWidth
            value={searchInput || ""}
            onChange={(event: any) => {
                setSearchInput(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}

export default ProductSearch