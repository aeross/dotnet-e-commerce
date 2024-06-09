import { Box, Typography, Pagination } from "@mui/material"
import { MetaData } from "../models/pagination"

interface Props {
    metaData: MetaData | null;
    onPageChange: (page: number) => void;
}

function AppPagination({ metaData, onPageChange }: Props) {

    if (!metaData) return;

    const { CurrentPage, PageSize, TotalPages, TotalCount } = metaData;

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>
                Displaying {(CurrentPage - 1) * PageSize + 1}-
                {(CurrentPage * PageSize > TotalCount) ? TotalCount : (CurrentPage * PageSize)} out of {TotalCount} items
            </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={TotalPages}
                page={CurrentPage}
                onChange={(_, page) => onPageChange(page)}
            />
        </Box>
    )
}

export default AppPagination