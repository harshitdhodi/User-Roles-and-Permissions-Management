'use client'
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical, Search, Filter, ArrowUpDown, MoveLeft, Activity, RefreshCcw } from 'lucide-react'
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "@/store/api/userSliceApi"
import { useGetRolesDataQuery } from "@/store/api/role.api"
import { useGetPermissionsQuery } from "@/store/api/permissionApiSlice.api"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useUpdateUserProfileMutation } from "@/store/api/apiSlice"
import { toast } from "react-toastify"
import CreateUserModal from "./CreateUserModal"
import { useThemeContext } from "@/hooks/color-context"
import { useThemeClasses } from "@/hooks/colorThem"
import { RoleDropdown } from "./RoleDropdown"
import { useDeleteUserSessionMutation } from "@/store/api/sessionApiSlice"
import SMTPDetailsModal from "./userDetails/SMTPDetailsModal"
import BreadcrumbComp from "@/utils/BreadcrumbComp"

export default function Users() {
  const navigate = useNavigate()
  const { data: users = [], isLoading: isLoadingUsers, refetch } = useGetUsersQuery()
  const { data: permissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery()
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesDataQuery({ page: 1, limit: 10 });
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteSession] = useDeleteUserSessionMutation();
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isSmtpUserModalOpen, setIsSmtpUserModalOpen] = useState(false)
  const [selectedSmtpUserId, setSelectedSmtpUserId] = useState(null)

  useEffect(() => {
    if (users?.users?.length > 0) {
      setFilteredUsers(users.users)
    }
  }, [users])

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = users.users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
    )

    setFilteredUsers(filtered)
  }

  const handleToggleStatus = async (userId) => {
    try {
      await updateUserStatus(userId).unwrap();
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  const handleUserAction = async (action, userId) => {
    switch (action) {
      case 'view':
        navigate(`/users/${userId}`)
        break
      case 'permissions':
        navigate(`/permissions`)
        break
      case 'terminate':
        await deleteSession(userId).unwrap();
        toast.success(`Terminating sessions for user ${userId}`);
        break
      case 'toggle-status':
        const updatedUsers = filteredUsers.map(user =>
          user.id === userId
            ? { ...user, isActive: !user.isActive }
            : user
        )
        setFilteredUsers(updatedUsers)
        break
      case 'smtp-details':
        setSelectedSmtpUserId(userId)
        setIsSmtpUserModalOpen(true)
        break
    }
  }

  if (isLoadingRoles) {
    return <p>loading role</p>
  }

  if (isLoadingUsers || isLoadingRoles || isLoadingPermissions) {
    return <div>Loading...</div>
  }
  const themecolor = useThemeClasses();


  const breadcrumbItems = [
    { path: '/', label: 'Home' },
    { path: '/Users', label: 'Read Users' },
  ];
  return (
    <div className="w-full  mx-auto p-4 space-y-4  bg-white">
      <BreadcrumbComp items={breadcrumbItems}  />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm relative">
          <Input

            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className={themecolor.border + " outline-0 outline-none pl-8  focus:border-0 focus:outline-none active:outline-0 "}
          />
          <Search className="w-4 h-4 text-muted-foreground absolute ml-2" />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
          <Button size="sm" className={`${themecolor.bg} ${themecolor.hover}`} onClick={() => setIsCreateUserModalOpen(true)}>
            Create User
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  className={themecolor.border + " " + themecolor.ring}
                  checked={selectedUsers.length === filteredUsers.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUsers(filteredUsers.map(user => user.id))
                    } else {
                      setSelectedUsers([])
                    }
                  }}
                />

              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>

                <TableCell>
                  <Checkbox
                    className={themecolor.border + " " + themecolor.ring}
                    checked={selectedUsers.includes(user.id)}

                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers([...selectedUsers, user.id])
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                      }
                    }}
                  />

                </TableCell>
                <TableCell>
                  {user.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 border-1">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`http://localhost:5000${user.img}`} alt="@shadcn" />
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      {user.sessions.length > 0 && (
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>

                  <RoleDropdown
                    user={user}
                    roles={roles.roles}

                  />
                </TableCell>
                <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={user.isActive ? " bg-green-700" : " bg-red-600"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>

                  <Button
                    type="button"
                    size="sm"
                    className={`relative ${themecolor.border + ' ' + themecolor.bg + ' '}  ${themecolor.hover}  text-sm font-medium text-white`}
                  >
                    <Link to={`${user.id}`}>
                    <Activity className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">View Activities</span>
                    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900 shadow-md">
                      {user._count.activityLogs}
                    </div>
                    </Link>
                   
                  </Button>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUserAction('view', user.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={() => handleUserAction('smtp-details', user.id)}
                  >
                    SMTP Details
                  </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUserAction('permissions', user.id)}>
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleUserAction('terminate', user.id)}
                      >
                        Terminate Sessions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? "Disable User" : "Enable User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          page {users?.pagination?.page} | pages {users?.pagination?.pages}|  total {users?.pagination?.total} users
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        roles={roles.roles}
      />
      {/* <Outlet/> */}
      <SMTPDetailsModal
        isOpen={isSmtpUserModalOpen}
        onClose={() => {
          setIsSmtpUserModalOpen(false)
          setSelectedSmtpUserId(null)
        }}
        userId={selectedSmtpUserId}
      />

    </div>
  )
}

