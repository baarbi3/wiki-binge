'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Earth,
  Home,
  Palette,
  Settings,
} from "lucide-react"

import { NavUser } from "./SidebarUser"
import { useAuth } from "../context/AuthContext"
import { User } from '../types/auth/user';
import Link from 'next/link';


type Data = {
  navMain: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
}

const data: Data = {
  navMain: [
    {
      title: "Feed",
      url: "/app",
      icon: <Home />,
    },
    {
      title: "Personality",
      url: "app/personality",
      icon: <Palette />,
    },
    {
      title: "Explore",
      url: "#",
      icon: <Earth />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings />,
    },
  ],
}

const AppSidebar = () => {
  const { userDataObj } = useAuth()

  const user: User | null = userDataObj
    ? {
        name: userDataObj.username,
        email: userDataObj.email,
        avatar: userDataObj.profile_img,
      }
    : null

  return (
    <Sidebar>
      <SidebarHeader />

      <SidebarContent className="flex flex-col justify-center">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>

                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar