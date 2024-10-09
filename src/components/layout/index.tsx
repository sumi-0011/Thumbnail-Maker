import React from "react";
import { Header } from "../header";
import Contact from "../contact/Contact";

export const getNoneLayout = (page: React.ReactElement) => page;

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="h-min-screen mx-auto flex h-[900px] min-h-screen w-fit items-center justify-center bg-[#1D2027] p-6">
      {page}
      <Contact />
    </div>
  );
};
