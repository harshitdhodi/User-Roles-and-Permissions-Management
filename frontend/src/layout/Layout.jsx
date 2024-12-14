
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardLayout from "./DashboardLayout"
import { ThemeProvider } from "@/hooks/color-context"
import { Outlet } from "react-router-dom"
export default function RootLayout() {
    return (
        <ThemeProvider>

        <div className=" w-full">

            <SidebarProvider>
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </SidebarProvider>
        </div>
        </ThemeProvider>

    )
}

