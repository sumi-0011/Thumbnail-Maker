import React, { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import ReactGA from "react-ga4";
import Home from "./pages/home";
import GalleryPage from "./pages/gallery";
import ErrorPage from "./components/error-page";
import { Layout } from "./components/layout";
import { HotkeysProvider } from "react-hotkeys-hook";

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), []);

  useEffect(() => {
    const gaId = import.meta.env.VITE_APP_GA_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
    } else {
      console.error("Google Analytics ID is not set in environment variables");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HotkeysProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/gallery"
                element={
                  <Layout>
                    <GalleryPage />
                  </Layout>
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </HotkeysProvider>
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
