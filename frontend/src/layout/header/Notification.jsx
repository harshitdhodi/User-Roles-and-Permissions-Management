"use client"

import { useThemeContext } from '@/hooks/color-context'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Bell, X } from 'lucide-react'

// Sample notifications data
const notifications = [
    { id: 1, message: "New message from John", time: "5m ago", read: false },
    { id: 2, message: "You have a meeting at 3 PM", time: "1h ago", read: false },
    { id: 3, message: "Your report has been approved", time: "2h ago", read: true },
    { id: 4, message: "System update completed", time: "1d ago", read: true },
]

export default function Notification() {
    const { themeColor } = useThemeContext()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative",
                        `hover:bg-${themeColor}-100 text-${themeColor}-500`
                    )}
                >
                    <Bell className="h-4 w-4" />
                    <span className={`absolute right-2 top-2 h-2 w-2 rounded-full bg-${themeColor}-500`} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-72 mr-32 p-0", `border-${themeColor}-200`)}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" className={`text-${themeColor}-500 hover:text-${themeColor}-700`}>
                        Mark all as read
                    </Button>
                </div>
                <ul className="divide-y divide-gray-200 max-h-[300px] overflow-auto">
                    {notifications.map((notification) => (
                        <li key={notification.id} className={cn(
                            "flex items-start p-4 hover:bg-gray-50",
                            !notification.read && `bg-${themeColor}-50`
                        )}>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium",
                                    notification.read ? "text-gray-900" : `text-${themeColor}-600`
                                )}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            <Button variant="ghost" size="icon" className={`text-gray-400 hover:text-${themeColor}-500`}>
                                <X className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
                <div className="p-4 border-t border-gray-200">
                    <Button variant="outline" className="w-full" onClick={() => console.log("View all notifications")}>
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

