"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { items } from "./Sidebar-Items";

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex justify-center items-center">
              <Image src="/logo.svg" alt="logo" width={120} height={100} />
            </div>
          </SidebarGroupLabel>

          <div className="h-px bg-gray-700 my-4 w-full" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.type === "group" && item.children?.length) {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex w-full justify-between items-center my-2">
                          <div className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu className="ml-4 mt-2 border-l border-gray-700 pl-3">
                            {item.children.map((child) => (
                              <SidebarMenuItem key={child.title} className="my-2">
                                <SidebarMenuButton asChild>
                                  <Link href={child.url} className="flex items-center gap-2">
                                    <child.icon />
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                if (item.type === "single") {
                  return (
                    <SidebarMenuItem key={item.title} className="my-2">
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return null;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}