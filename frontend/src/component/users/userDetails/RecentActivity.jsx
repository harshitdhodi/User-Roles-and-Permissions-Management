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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 overflow-hidden shadow-lg">
          <CardHeader className="relative p-6 bg-white border-b">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={`http://localhost:5000${user.img}`} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-lg text-gray-600 flex items-center mt-1">
                  <Mail className="w-5 h-5 mr-2 text-gray-400" />
                  {user.email}
                </p>
                <div className="flex mt-2 space-x-2">
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="secondary">{user.role.name}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white  rounded-lg">
            <TabsTrigger value="info" className="py-3">User Information</TabsTrigger>
            <TabsTrigger value="activity" className="py-3">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card className="shadow-lg capitalize ">
              <CardHeader>
                <CardTitle className="text-xl ">User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 ">Username</p>
                      <p className="text-lg font-medium text-gray-900 capitalize">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-lg font-medium text-gray-900">{user.role.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="text-lg font-medium text-gray-900">{new Date(user.lastLogin).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={user.isActive ? "success" : "destructive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.role.permissions.map((perm) => (
                      <li key={perm.permission.id} className="flex items-center space-x-2 text-gray-700">
                        <Shield className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">{perm.permission.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-900">Activity Logs</CardTitle>
                <Button variant="outline" size="sm" onClick={toggleSortOrder} className="text-gray-600">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                </Button>
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
                    className="text-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-gray-600"
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
    </div>
  )
}

