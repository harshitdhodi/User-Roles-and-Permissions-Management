"use client"

import { useThemeContext } from '@/hooks/color-context'
import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AvatarDemo() {
  const { themeColor } = useThemeContext()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const img = useSelector((state) => state.auth?.user?.img)

  if (!isAuthenticated) return null

  return (
    <div className="relative">
      <Avatar>
        <AvatarImage
          src={`http://localhost:5000${img}`}
          alt="User Profile"

        />
        <AvatarFallback className={cn(`bg-${themeColor}-100 text-${themeColor}-500`)}>
          SP
        </AvatarFallback>
      </Avatar>

    </div>
  )
}