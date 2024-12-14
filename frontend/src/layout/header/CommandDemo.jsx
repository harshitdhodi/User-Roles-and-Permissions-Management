"use client"

import { useThemeContext } from '@/hooks/color-context'
import { cn } from "@/lib/utils"
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export  default function CommandDemo() {
  const { themeColor } = useThemeContext()

  return (
    <Command className={cn("rounded-lg border shadow-md w-full", `border-${themeColor}-200`)}>
      <CommandInput placeholder="Type a command or search..." className={`focus-visible:ring-${themeColor}-500`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem className={`hover:bg-${themeColor}-100`}>
            <Calendar className={`mr-2 h-4 w-4 text-${themeColor}-500`} />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem className={`hover:bg-${themeColor}-100`}>
            <Smile className={`mr-2 h-4 w-4 text-${themeColor}-500`} />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      
      </CommandList>
    </Command>
  )
}

