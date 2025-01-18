"use client";

import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                    },
                },
                mutationCache: new MutationCache({
                    onError: async (error) => {
                        console.error(error);
                        // await handleHTTPResponse(error, router);
                    },
                }),
                queryCache: new QueryCache({
                    onError: async (error, query) => {
                        if (query.meta?.onError) {
                            query.meta.onError(error);
                        }
                        // await handleHTTPResponse(error, router);
                    },
                }),
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
