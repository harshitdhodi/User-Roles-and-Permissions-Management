
'use client'

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { User, Mail, Key, Calendar, Activity, Server, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample data (normally this would come from an API)
const userData = {
    "id": 8,
    "username": "yash Desai",
    "email": "bewimo@mailinator.com",
    "firstName": "Knox",
    "lastName": "Alexander",
    "isActive": true,
    "lastLogin": "2024-12-13T10:31:11.748Z",
    "createdAt": "2024-12-13T05:57:29.496Z",
    "img": "/uploads/profile-images/profile-undefined-1734073608478-661408056.jpg",
    "role": {
        "id": 1,
        "name": "Sales",
        "permissions": [
            {
                "permission": {
                    "id": 1,
                    "name": "User Management",
                    "description": "Manage all information related to customer leads, including tracking, assigning, and updating lead details."
                }
            },
            {
                "permission": {
                    "id": 2,
                    "name": "Dashboard",
                    "description": "Manage all information related to customer leads, including tracking, assigning, and updating lead details."
                }
            },
            {
                "permission": {
                    "id": 4,
                    "name": "Accounts",
                    "description": "Manage all information related to customer leads, including tracking, assigning, and updating lead details."
                }
            }
        ]
    },
    "sessions": [
        {
            "id": 23,
            "createdAt": "2024-12-13T10:31:11.693Z",
            "ipAddress": "::1",
            "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "expiresAt": "2024-12-14T10:31:11.692Z"
        }
    ],
    "activityLogs": [
        {
            "id": 650,
            "activityType": "PROFILE_ACCESS",
            "description": "Accessed profile of user 8",
            "ipAddress": "::1",
            "createdAt": "2024-12-13T10:31:12.659Z"
        },
        {
            "id": 649,
            "activityType": "LOGIN_SUCCESS",
            "description": "Successful user login",
            "ipAddress": "::1",
            "createdAt": "2024-12-13T10:31:11.823Z"
        },
        {
            "id": 645,
            "activityType": "PROFILE_ACCESS",
            "description": "Accessed profile of user 8",
            "ipAddress": "::1",
            "createdAt": "2024-12-13T09:37:24.653Z"
        }
    ],
    "_count": {
        "activityLogs": 3,
        "sessions": 1
    },
    "smtpInfo": {
        "host": "smtp.example.com",
        "port": 587,
        "username": "yash.desai@example.com",
        "encryption": "TLS"
    }
}

export default function UserDetails() {
    const { id } = useParams()
    const user = userData // In a real app, you'd fetch this based on the id
    const [activeTab, setActiveTab] = useState("profile")

    if (!user) {
        return <div className="text-center text-2xl mt-8">User not found!</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <BreadcrumbDemo user={user} />
            <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20 ring-2 ring-blue-500 dark:ring-blue-400">
                            <AvatarImage src={user.img} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback className="bg-blue-200 text-blue-700">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">{user.firstName} {user.lastName}</h1>
                            <p className="text-sm text-blue-600 dark:text-blue-300">{user.email}</p>
                            <Badge variant={user.isActive ? "success" : "destructive"} className="mt-1">
                                {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 bg-blue-100 dark:bg-gray-700 p-1 rounded-lg">
                            {["profile", "activity", "sessions", "permissions"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={`relative ${!activeTab ? 'text-white' : 'text-blue-700'} `}
                                >
                                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <motion.div
                                        className="absolute  text-white  pt-[6px] bottom-0 left-0 right-0 h-full bg-blue-500 dark:bg-blue-600 rounded-md  bg-blend-exclusion"
                                        layoutId="activeTab"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}

                                        </motion.div>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="profile">
                            <UserProfile user={user} />
                        </TabsContent>
                        <TabsContent value="activity">
                            <RecentActivity user={user} />
                        </TabsContent>
                        <TabsContent value="sessions">
                            <RecentSessions user={user} />
                        </TabsContent>
                        <TabsContent value="permissions">
                            <Permissions user={user} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </div>
        </div>
    )
}

function UserProfile({ user }) {
    return (
        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Username:</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300">{user.username}</span>
                    <EditIcon />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Email:</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                    <EditIcon />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Role:</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{user.role.name}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Last Login:</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{new Date(user.lastLogin).toLocaleString()}</span>
            </div>
            <SMTPInfo smtpInfo={user.smtpInfo} />
        </div>
    )
}

function SMTPInfo({ smtpInfo }) {
    return (
        <div className="mt-6 border-t border-blue-200 dark:border-blue-700 pt-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">SMTP Information</h3>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Host:</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300">{smtpInfo.host}</span>
                        <EditIcon />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Port:</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300">{smtpInfo.port}</span>
                        <EditIcon />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Username:</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300">{smtpInfo.username}</span>
                        <EditIcon />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Encryption:</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300">{smtpInfo.encryption}</span>
                        <EditIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

function RecentActivity({ user }) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(user.activityLogs.length / itemsPerPage)

    const paginatedLogs = user.activityLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Recent Activity</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-blue-700 dark:text-blue-300">Type</TableHead>
                        <TableHead className="text-blue-700 dark:text-blue-300">Description</TableHead>
                        <TableHead className="text-blue-700 dark:text-blue-300">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedLogs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="text-gray-700 dark:text-gray-300">{log.activityType}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{log.description}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{new Date(log.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between mt-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Previous
                </Button>
                <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

function RecentSessions({ user }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Recent Sessions</h2>
            <ScrollArea className="h-[300px]">
                {user.sessions.map((session) => (
                    <div key={session.id} className="mb-4 p-2 bg-blue-50 dark:bg-gray-700 rounded-md flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500 animate-pulse" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" />
                        </svg>
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-blue-700 dark:text-blue-300">IP:</strong> {session.ipAddress}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-blue-700 dark:text-blue-300">User Agent:</strong> {session.userAgent}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-blue-700 dark:text-blue-300">Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-blue-700 dark:text-blue-300">Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}

function Permissions({ user }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Permissions & Settings</h2>
            <p className="text-gray-700 dark:text-gray-300"><strong className="text-blue-700 dark:text-blue-300">Role:</strong> {user.role.name}</p>
            <h3 className="font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-300">Permissions:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {user.role.permissions.map((perm) => (
                    <li key={perm.permission.id}>
                        <span className="text-blue-600 dark:text-blue-400">{perm.permission.name}</span> - {perm.permission.description}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function BreadcrumbDemo({ user }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">Users</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-600 dark:text-gray-400">{user.firstName + ' ' + user.lastName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

function EditIcon() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 text-blue-500 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
