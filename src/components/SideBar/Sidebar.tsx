"use client";

import * as React from "react";

import { GalleryVerticalEnd, ImageIcon, SmileIcon } from "lucide-react";

import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "src/components/ui/sidebar";
import { cn } from "src/lib/utils";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "marcexample.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "space",
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: "Thumbnail Maker",
      url: "https://thumbnail.ssumi.space/",
      icon: ImageIcon,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Gallery",
          url: "/gallery",
        },
        {
          title: "Github",
          url: "https://github.com/sumi-0011/Thumbnail-Maker",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Maker Contact",
      url: "https://various.ssumi.space/maker",
      icon: SmileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup className="flex items-end justify-end pt-4">
          <SidebarTrigger
            className={cn("relative", open ? "left-[-5px]" : "left-[3px]")}
          />
        </SidebarGroup>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
