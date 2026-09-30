"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ✅ Cache 5 minute tak fresh rahega
            staleTime: 5 * 60 * 1000,

            // ✅ Cache 10 minute tak memory mein rahega
            gcTime: 10 * 60 * 1000,

            // ✅ Window focus pe refetch NA karo
            refetchOnWindowFocus: false,

            // ✅ Network reconnect pe refetch NA karo
            refetchOnReconnect: false,

            // ✅ Mount pe refetch NA karo (agar cache hai)
            refetchOnMount: false,

            // ✅ Retry kam karo
            retry: 1,

            // ✅ Error pe retry delay
            retryDelay: 1000,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}