import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Cart } from "../models/cart";

interface StoreContextValue {
    cart: Cart | null
    setCart: (cart: Cart) => void
    removeItem: (productId: number, qty: number) => void
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function UseStoreContext() {
    const context = useContext(StoreContext);

    if (context === undefined)
        throw Error("Oops - the context cannot be accessed here. We do not seem to be inside the context provider.")

    return context;
}

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
    // the state that will be provided to your context
    const [cart, setCart] = useState<Cart | null>(null);


    function removeItem(productId: number, qty: number) {
        if (!cart) return;

        const items = [...cart.items];
        const itemIndex = items.findIndex(i => i.productId === productId);

        if (itemIndex >= 0) {
            items[itemIndex].quantity -= qty;
            if (items[itemIndex].quantity <= 0) {
                items.splice(itemIndex, 1);
            }
            setCart(prevState => {
                return { ...prevState!, items }
            });
        }

    }
    return (
        <StoreContext.Provider value={{ cart, setCart, removeItem }}>
            {children}
        </StoreContext.Provider>
    )
}