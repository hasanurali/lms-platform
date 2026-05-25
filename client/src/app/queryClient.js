import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ENDPOINTS } from '../api/endpoints';

const handleError = (error) => {
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || error.response?.data;
        const requestUrl = error.config?.url || "";

        // Check if login or refresh url
        const isLoginOrRefreshRoute = requestUrl.includes(ENDPOINTS.AUTH.LOGIN)
            || requestUrl.includes(ENDPOINTS.AUTH.REFRESH);

        // Silently ignore errors from login or refresh endpoints
        if (isLoginOrRefreshRoute) {
            return;
        }

        // Handle all other API errors
        toast.error(serverMessage || "Something went wrong");
        return;
    }

    // Handle non-axios / system errors
    toast.error(error?.message || "System error occurred");
};

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: handleError,
    }),

    mutationCache: new MutationCache({
        onError: handleError,
    }),

    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
});

export default queryClient;
