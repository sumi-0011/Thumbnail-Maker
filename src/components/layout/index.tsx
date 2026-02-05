import React from "react";
import { Header } from "../header";
import Contact from "../contact/Contact";
import { Separator } from "@radix-ui/react-select";
import { AppSidebar } from "../SideBar/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "src/components/ui/breadcrumb";

export const getNoneLayout = (page: React.ReactElement) => page;

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {page}
      </SidebarInset>
    </SidebarProvider>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen overflow-hidden bg-[#1D2027]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
