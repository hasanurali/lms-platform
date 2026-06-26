import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import queryClient from "./queryClient";
import SocketManager from "./SocketManager";

const Providers = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SocketManager />
            {children}
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
};

export default Providers;