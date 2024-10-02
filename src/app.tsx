import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./router";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={createRouter()} />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
