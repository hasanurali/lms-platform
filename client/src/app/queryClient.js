import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ENDPOINTS } from '../api/endpoints';

const handleError = (error, query) => {
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        const requestUrl = error.config?.url || "";

        // Check if login or refresh url
        const isLoginOrRefreshRoute = requestUrl.includes(ENDPOINTS.AUTH.LOGIN)
            || requestUrl.includes(ENDPOINTS.AUTH.REFRESH);

        // Silently ignore errors from login or refresh endpoints and reset query cache
        if (isLoginOrRefreshRoute) {
            if (query) {
                setTimeout(() => queryClient.resetQueries({ queryKey: query.queryKey }), 0);
            };
            return;
        }

        // Handle all other API errors
        toast.error(serverMessage || "Something went wrong");

    } else {

        // Handle non-axios / system errors
        toast.error(error?.message || "System error occurred");
    };

    // Reset query cache
    if (query) {
        setTimeout(() => queryClient.resetQueries({ queryKey: query.queryKey }), 0);
    };
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
