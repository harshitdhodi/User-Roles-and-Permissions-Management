import React from 'react'
import { Shield, Key, Smartphone, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Permissions({ user }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Permissions & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Role</h3>
          <Badge variant="secondary" className="text-base py-1 px-3">
            {user.role.name}
          </Badge>
        </div>

        <div>
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
  )
}
