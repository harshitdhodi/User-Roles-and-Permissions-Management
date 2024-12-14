import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useThemeContext } from "@/hooks/color-context"
import { useCallback } from "react";
import { cn } from "@/lib/utils"
export default function RecentSales() {
    const { themeColor } = useThemeContext();
    const getThemeStyles = useCallback((isActive) => {
        const baseStyles = "transition-colors"
        const activeStyles = isActive ? `text-${themeColor}-500 border-r-[3px] border-${themeColor}-500` : ""
        const hoverStyles = `hover:text-${themeColor}-500`
        return cn(baseStyles, activeStyles, hoverStyles)
    }, [themeColor])
    return (
        <div className="space-y-8">
            <div className="flex items-center">

                <Avatar className={`h-9 w-9 ${getThemeStyles(true)}`}>
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none  ">Olivia Martin</p>
                    <p className="text-sm text-muted-foreground">
                        olivia.martin@email.com
                    </p>
                </div>
                <div className="ml-auto font-medium">+₹1,999.00</div>
            </div>
            <div className="flex items-center">
                <Avatar className={`h-9 w-9 ${getThemeStyles(true)}`}>
                    <AvatarImage src="/avatars/02.png" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Jackson Lee</p>
                    <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
                <div className="ml-auto font-medium">+₹39.00</div>
            </div>
            <div className="flex items-center">
                <Avatar className={`h-9 w-9 ${getThemeStyles(true)}`}>
                    <AvatarImage src="/avatars/03.png" alt="Avatar" />
                    <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                    <p className="text-sm text-muted-foreground">
                        isabella.nguyen@email.com
                    </p>
                </div>
                <div className="ml-auto font-medium">+₹299.00</div>
            </div>
            <div className="flex items-center">
                <Avatar className={`h-9 w-9 ${getThemeStyles(true)}`}>
                    <AvatarImage src="/avatars/04.png" alt="Avatar" />
                    <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">William Kim</p>
                    <p className="text-sm text-muted-foreground">will@email.com</p>
                </div>
                <div className="ml-auto font-medium">+₹99.00</div>
            </div>
        </div>
    )
}

