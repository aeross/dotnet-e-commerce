import { Button, Container, Divider, Paper, Typography } from "@mui/material"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <Container component={Paper} sx={{ height: 400 }}>
            <Typography gutterBottom variant="h3" color="secondary">404 - Not Found Error</Typography>
            <Divider />
            <Typography gutterBottom variant="h5">We could not find what you are looking for.</Typography>
            <Button fullWidth component={Link} to="/catalogue">Back to shop</Button>
        </Container>
    )
}

export default NotFound