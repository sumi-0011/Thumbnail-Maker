import React from "react";
import { Header } from "../header";

export const getNoneLayout = (page: React.ReactElement) => page;

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="h-min-screen flex min-h-screen items-center justify-center bg-[#1D2027]">
      {/* <Header /> */}
      {page}
    </div>
  );
};
