import { Backdrop, Box, CircularProgress, Typography } from "@mui/material"

function Loading({ message = "Loading..." }: { message?: string }) {
    return (
        <Backdrop open={true} invisible={true} sx={{ zIndex: "-1" }}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress size={100} color="secondary" sx={{ marginBottom: "2rem" }} />
                <Typography variant="h4" sx={{ justifyContent: "center", position: "fixed", top: "60%" }}>{message}</Typography>
            </Box>
        </Backdrop>
    )
}

export default Loading