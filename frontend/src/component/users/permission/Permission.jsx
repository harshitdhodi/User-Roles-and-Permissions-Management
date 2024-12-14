import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetPermissionsQuery,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation, // New mutation for removing permission
  useGetAllRolePermissionsQuery,
} from "@/store/api/permissionApiSlice.api";
import { useGetRolesDataQuery } from "@/store/api/role.api";
import { toast } from "react-toastify";

export default function Permission() {
  const { data: rolesData = [] } = useGetRolesDataQuery({ page: 1, limit: 10 });
  const { data: permissionsData = [] } = useGetPermissionsQuery();
  const { data: rolePermissions = [] } = useGetAllRolePermissionsQuery();

  const [assignPermissions] = useAssignPermissionToRoleMutation();
  const [removePermissionFromRole] = useRemovePermissionFromRoleMutation(); // Mutation for removing permission

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Auto-check permissions when role is selected
  useEffect(() => {
    if (selectedRole) {
      const permissionsForRole = rolePermissions
        .filter((rolePermission) => rolePermission.roleId.toString() === selectedRole)
        .map((rolePermission) => rolePermission.permissionId);
      setSelectedPermissions(permissionsForRole);
    }
  }, [selectedRole, rolePermissions]);

  const handlePermissionChange = useCallback(async (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      // Uncheck: Remove permission from the role
      try {
        await removePermissionFromRole({ roleId: selectedRole, permissionId });
        setSelectedPermissions((prev) => prev.filter((id) => id !== permissionId));
        toast.success("Success")
      } catch (error) {
        toast.error(error.message);
        console.error("Failed to remove permission:", error);
      }
    } else {
      // Check: Assign permission to the role
      try {
        await assignPermissions({ roleId: parseInt(selectedRole), permissionId: parseInt(permissionId) });
        setSelectedPermissions((prev) => [...prev, permissionId]);
        toast.success("Success")
      } catch (error) {
        toast.error(error.message);
        console.error("Failed to assign permission:", error);
      }
    }
  }, [selectedPermissions, selectedRole, assignPermissions, removePermissionFromRole]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        selectedPermissions.map((permissionId) =>
          assignPermissions({ roleId: parseInt(selectedRole), permissionId: parseInt(permissionId) })
        )
      );
      toast.success("Success")
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to assign permissions:", error);
    }
  }, [selectedRole, selectedPermissions, assignPermissions]);

  return (
    <div className="container mx-auto">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Assign Permissions</CardTitle>
          <CardDescription>Select a role and assign specific permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-select">Select Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesData.roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Permissions</Label>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionsData.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id.toString()}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionChange(permission.id)}
                        />
                        <label htmlFor={permission.id.toString()}>{permission.name}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
{/* 
            <Button type="submit" disabled={!selectedRole || selectedPermissions.length === 0}>
              Assign Permissions
            </Button> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
