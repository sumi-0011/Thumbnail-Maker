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

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), []);

  useEffect(() => {
    ReactGA.initialize(`${import.meta.env.VITE_APP_GA_ID}`);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <div className="h-min-screen mx-auto flex h-[900px] min-h-screen w-fit items-center justify-center bg-[#1D2027] p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </Router>
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
