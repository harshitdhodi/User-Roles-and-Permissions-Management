"use client"

import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ChevronDown, CreditCard, HelpCircle, Home, LayoutDashboard, LogOut, Settings, User, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import logo from '../assets/logo.png'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useThemeContext } from '@/hooks/color-context'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSelector } from 'react-redux'

const submenuLineStyles = `
  relative before:absolute before:left-[11px] before:top-0 before:h-full before:w-px before:bg-gray-200
  [&>li:last-child]:before:h-[1.1rem]
`;
const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/",
      },
      {
        title: "Sales Analytics",
        icon: BarChart3,
        url: "/analytics",
        children: [
          { title: "Revenue", url: "/analytics/revenue" },
          { title: "Conversion", url: "/analytics/conversion" },
        ],
      },
      {
        title: "Sales Manager",
        icon: CreditCard,
        url: "/sales",
        children: [
          { title: "Leads", url: "/sales/leads" },
          { title: "Deals", url: "/sales/deals" },
        ],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Accounts",
        icon: Users,
        url: "/accounts",
      },

      {
        title: "User Management",
        icon: User,
        children: [
          {
            title: "Read Users",
            icon: Users,
            url: "/users",
          },
          {
            title: "Permissions",
            icon: User,
            url: "/permissions",
          },
          {
            title: "Roles",
            icon: User,
            url: "/roles",
          },
        ],
      },
    ],
  },
];

export default function DashboardSidebar() {
  const [openItems, setOpenItems] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const { themeColor } = useThemeContext()

  // Safe permissions extraction with fallback
  const permissions = useSelector(state =>
    state.auth.user?.role.permissions || []
  )

  
  // Memoized function to check if an item is permitted
  // Memoized function to check if an item is permitted
  const isItemPermitted = useCallback((itemTitle) => {
    // If no permissions, show everything
    if (permissions.length === 0) return true

    return permissions.some(
      perm => {
        const permissionName = perm.permission?.name?.toLowerCase() || ''
        const itemTitleNormalized = itemTitle.toLowerCase()

        // Create a regex pattern that allows partial, case-insensitive matches
        // Escape special regex characters in the permission name
        const escapedPermissionName = permissionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        // Create a regex that matches if the permission name is part of the item title
        const permissionRegex = new RegExp(escapedPermissionName, 'i')

        return permissionRegex.test(itemTitleNormalized)
      }
    )
  }, [permissions])

  // Filter navigation based on permissions
  const filteredNavigation = useMemo(() => {
    return navigation.map(group => ({
      ...group,
      items: group.items.filter(item =>
        isItemPermitted(item.title) ||
        // If the item has children, keep it if any child is permitted
        (item.children && item.children.some(child => isItemPermitted(child.title)))
      )
    })).filter(group => group.items.length > 0)
  }, [isItemPermitted])

 


  
  const toggleItem = (title) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    );
  };
  
  const handleItemClick = (title) => {
    setActiveItem(title);
  };
  
  const getThemeStyles = (isActive) => {
    const baseStyles = "transition-colors";
    const activeStyles = isActive
      ? `text-${themeColor}-500 border-r-[3px] border-${themeColor}-500`
      : "";
    const hoverStyles = `hover:text-${themeColor}-500`;
    return cn(baseStyles, activeStyles, hoverStyles);
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4 ">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <img src={logo} alt="shantipatra logo" />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 mb-0">
        {filteredNavigation.map((group) => (
          <SidebarGroup className=" pb-0" key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent >
              <SidebarMenu className="pl-2  overflow-hidden">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.children ? (
                      <Collapsible open={openItems.includes(item.title)} onOpenChange={() => toggleItem(item.title)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={cn(
                              "w-full justify-between",
                              getThemeStyles(activeItem === item.title)
                            )}
                            onClick={() => handleItemClick(item.title)}
                          >
                            <span className="flex items-center ">
                              <item.icon className="h-4 w-4 mr-2" />
                              <span className=' pl-2'>

                                {item.title}
                              </span>
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${openItems.includes(item.title) ? 'rotate-180' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu className={`mt-2 ml-6 space-y-1 ${submenuLineStyles}`}>
                            {item.children.map((child, index) => (
                              <SidebarMenuItem key={child.title} className={index === item.children.length - 1 ? 'pb-1' : ''}>
                                <SidebarMenuButton
                                  asChild
                                  className={cn(
                                    "pl-2 flex items-center whitespace-nowrap overflow-hidden text-ellipsis",
                                    getThemeStyles(activeItem === child.title)
                                  )}
                                  onClick={() => handleItemClick(child.title)}
                                >
                                  <Link to={child.url} className="flex items-center">
                                    <span className={cn(
                                      "w-1.5 h-1.5 rounded-full mr-2 relative z-10",
                                      activeItem === child.title ? `bg-${themeColor}-500` : "bg-gray-300"
                                    )} />
                                    <span className="truncate">{child.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={getThemeStyles(activeItem === item.title) + `hover:text-${themeColor}-500`}
                        onClick={() => handleItemClick(item.title)}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4 mr-2" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="overflow-hidden">
        <SidebarMenu>
          <SidebarMenuSubItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuSubButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>John Doe</span>
                  </div>
                  <Settings className="h-4 w-4" />
                </SidebarMenuSubButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <Link to={'setting'}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuSubItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}