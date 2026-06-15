import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import queryClient from "./queryClient";
import GlobalContextProvider from "./GlobalContext"

const Providers = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <GlobalContextProvider>
                {children}
            </GlobalContextProvider>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
};

export default Providers;