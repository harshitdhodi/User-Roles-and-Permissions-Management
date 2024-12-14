import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateUserMutation } from "@/store/api/userSliceApi"
import { toast } from 'react-toastify'
import { useThemeContext } from '@/hooks/color-context'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, UserPlus } from 'lucide-react'



export default function CreateUserModal({ isOpen, onClose, roles }) {
  const [createUser] = useCreateUserMutation()
  const { themeColor } = useThemeContext()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, roleId: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser(formData).unwrap()
      toast.success("New user has been successfully created.")
      onClose()
    } catch (error) {
      toast.error("Failed to create user. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className={`h-6 w-6 text-${themeColor}-500`} />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new user. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Separator className={`my-4 bg-${themeColor}-200`} />
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`pl-10 border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Select onValueChange={handleRoleChange} value={formData.roleId}>
                  <SelectTrigger className={`border-${themeColor}-200 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className={`bg-${themeColor}-500 hover:bg-${themeColor}-600`}>
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

