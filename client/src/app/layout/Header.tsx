import { AppBar, Switch, Toolbar, Typography } from "@mui/material"

interface Props {
    dark: boolean,
    setDark: () => void
}

function Header({ dark, setDark }: Props) {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6">RE-STORE</Typography>
                <Switch checked={dark} onChange={setDark} />
            </Toolbar>
        </AppBar>
    )
}

export default Header