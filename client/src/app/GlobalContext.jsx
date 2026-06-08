import { createContext, useState } from "react";

export const GlobalContext = createContext(null);


const GlobalContextProvider = ({ children }) => {

    const [scrolled, setScrolled] = useState(false);

    return (
        <GlobalContext.Provider value={{ scrolled, setScrolled }}>
            {children}
        </GlobalContext.Provider>
    )
};

export default GlobalContextProvider;