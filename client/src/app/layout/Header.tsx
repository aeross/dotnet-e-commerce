import { ShoppingCart } from "@mui/icons-material"
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material"
import { Link, NavLink } from "react-router-dom"
import { useAppSelector } from "../store/configureStore"

const midLinks = [
    {
        title: "catalogue",
        path: "/catalogue"
    },
    {
        title: "contact",
        path: "/contact"
    },
    {
        title: "about",
        path: "/about"
    }
]

const rightLinks = [
    {
        title: "login",
        path: "/login"
    },

    {
        title: "register",
        path: "/register"
    }
]

const navStyles = {
    color: "inherit",
    textDecoration: "none",
    typography: "h6",
    "&:hover": {
        color: "lightblue"
    },
    "&.active": {
        color: "text.secondary"
    }
}

interface Props {
    dark: boolean,
    setDark: () => void
}

function Header({ dark, setDark }: Props) {
    const { cart } = useAppSelector(state => state.cart);

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        component={NavLink}
                        to="/"
                        sx={navStyles}
                    >
                        RE-STORE
                    </Typography>
                    <Switch checked={dark} onChange={setDark} />
                </Box>

                <List sx={{ display: "flex" }}>
                    {
                        midLinks.map(elem => {
                            return (
                                <ListItem
                                    component={NavLink}
                                    to={elem.path}
                                    key={elem.path}
                                    sx={navStyles}
                                >
                                    {elem.title.toUpperCase()}
                                </ListItem>
                            )
                        })
                    }
                </List>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        component={Link}
                        to='/cart'
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <Badge badgeContent={cart?.items.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    <List sx={{ display: "flex" }}>
                        {
                            rightLinks.map(elem => {
                                return (
                                    <ListItem
                                        component={NavLink}
                                        to={elem.path}
                                        key={elem.path}
                                        sx={navStyles}
                                    >
                                        {elem.title.toUpperCase()}
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header