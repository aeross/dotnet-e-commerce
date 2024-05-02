import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalogue from "../../features/catalogue/Catalogue";
import ProductDetails from "../../features/catalogue/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/catalogue',
                element: <Catalogue />
            },
            {
                path: '/catalogue/:id',
                element: <ProductDetails />
            },
            {
                path: '/about',
                element: <AboutPage />
            },
            {
                path: '/contact',
                element: <ContactPage />
            }
        ]
    }
])