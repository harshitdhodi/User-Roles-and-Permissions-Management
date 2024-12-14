import React, { useState } from 'react'
import { Check, Loader2, UserCog } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUpdateUserRoleMutation } from '@/store/api/userSliceApi'
import { useActionState } from 'react'
import { Separator } from '@/components/ui/separator'



export function RoleDropdown({ user, roles }) {
  const [updateRole] = useUpdateUserRoleMutation();
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setIsOpen(true)
  }

  const handleRoleUpdate = async () => {
    if (!selectedRole) return

    setIsUpdating(true)
    try {
      await updateRole({ userId: user.id, roleId: selectedRole.id }).unwrap()
      toast.success(`Role updated to ${selectedRole.name}`)
      //   onRoleUpdate()
    } catch (error) {
      console.error('Failed to update user role:', error)
      toast.error("Failed to update user role. Please try again.")
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
      setSelectedRole(null)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start font-normal"
          >
            <UserCog className="mr-2 h-4 w-4" />
            {user.role.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full mx-1 mr-2 px-2">
          {roles.map((role, index) => (
            <React.Fragment key={role.id}>
              <DropdownMenuItem
                onClick={() => handleRoleSelect(role)}
                className="justify-between mb-0"
              >
                {role.name}
                {role.id === user.role.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </DropdownMenuItem>
              {/* Render Separator only if it's not the last item */}
              {index < roles.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change {user.firstName} {user.lastName}'s role to {selectedRole?.name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

