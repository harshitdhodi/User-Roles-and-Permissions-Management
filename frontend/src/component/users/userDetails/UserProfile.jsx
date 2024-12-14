'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, Mail, Calendar, Shield, Activity, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

export default function UserProfile({ user }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('desc')
  const itemsPerPage = 5

  const sortedLogs = [...user.activityLogs].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage)

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="w-full  mx-auto p-6 space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <Avatar className="h-32 w-32 ring-4 ring-background">
              <AvatarImage src={`http://localhost:5000${user.img}`} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-4xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            {user.sessions.length > 0 && (
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 border-4 border-background rounded-full animate-pulse"></span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-20 pb-6 text-center">
          <h2 className="text-3xl font-bold mb-2">{user.firstName} {user.lastName}</h2>
          <p className="text-lg text-muted-foreground flex items-center justify-center mb-4">
            <Mail className="w-5 h-5 mr-2" />
            {user.email}
          </p>
          <div className="flex justify-center space-x-2">
            <Badge variant={user.isActive ? "success" : "destructive"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="secondary">{user.role.name}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">User Information</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-muted-foreground" />
                  <strong className="mr-2">Username:</strong> {user.username}
                </p>
                <p className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-2 text-muted-foreground" />
                  <strong className="mr-2">Role:</strong> {user.role.name}
                </p>
                <p className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                  <strong className="mr-2">Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}
                </p>
                <p className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2 text-muted-foreground" />
                  <strong className="mr-2">Status:</strong>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Permissions</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {user.role.permissions.map((perm) => (
                    <li key={perm.permission.id} className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{perm.permission.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Activity Logs</span>
                <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log, index) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{log.activityType}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

