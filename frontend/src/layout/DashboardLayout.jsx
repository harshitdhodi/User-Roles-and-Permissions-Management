"use client"

import  DashboardSidebar  from "./DashboardSidebar"
import  DashboardHeader from "./DashboardHeader"
import { SidebarInset } from "@/components/ui/sidebar"
import { useThemeClasses } from "@/hooks/colorThem"

export default function DashboardLayout({ children }) {
  const themecolor=useThemeClasses();
  
  return (
    <div className="flex w-full  bg-white overflow-hidden">
      <DashboardSidebar />
      <SidebarInset className="flex w-full flex-col">
        <DashboardHeader />
        <main  className="p-6">{children}</main>
      </SidebarInset>
    </div>
  )
}

