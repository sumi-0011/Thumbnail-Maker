import React, { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import ReactGA from "react-ga4";

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), []);

  useEffect(() => {
    ReactGA.initialize(`${import.meta.env.VITE_APP_GA_ID}`);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={createRouter()} />
        <Toaster
          toastOptions={{
            classNames: {
              toast: "min-w-[400px]",
              title: "text-base",
              icon: "w-6 h-6 icon-wrapper",
            },
          }}
          className="min-w-[400px]"
          position="top-right"
          duration={1000}
        />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
