"use client"

import { Bell, Plus, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useThemeContext } from '@/hooks/color-context'
import { cn } from "@/lib/utils"
import CommandDemo from './header/CommandDemo'
import  PopoverDemo  from './header/PopoverDemo'
import Notification from './header/Notification'
import { useSelector } from 'react-redux'

export default function DashboardHeader() { 
  const { themeColor } = useThemeContext()

  return (
    <header className={cn(
      "flex h-16 items-center gap-4 border-b bg-background px-6",
      `border-${themeColor}-200`
    )}>
      <SidebarTrigger className={`text-${themeColor}-500 hover:bg-${themeColor}-100`} />
      <div className="flex w-full max-w-md items-center gap-2">
      <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="h-9 md:w-[300px] lg:w-[400px]"
        />

        {/* <CommandDemo /> */}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Notification/>
        <PopoverDemo />
      </div>
    </header>
  )
}

