import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Monitor } from 'lucide-react';

export default function RecentSessions({ user }) {
    const {sessions}=user;
    return (
      
         <Card>
         <CardHeader>
           <CardTitle>Recent Sessions</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-6">
             <div className="text-center text-3xl font-bold">{sessions.length}</div>
             <p className="text-center text-sm text-muted-foreground">Total sessions</p>
             {sessions.map((session, index) => (
               <div key={index} className="space-y-4">
                 <div className="flex items-center space-x-2">
                   <Monitor className="h-4 w-4 text-muted-foreground" />
                   <span className="font-medium">IP:</span>
                   <span className="font-mono">{session.ipAddress}</span>
                 </div>
                 <div className="space-y-2 text-sm">
                   <p className="text-muted-foreground">
                     <span className="font-medium text-foreground">User Agent:</span> {session.userAgent}
                   </p>
                   <p>
                     <span className="font-medium">Created:</span> {new Date(session.createdAt).toLocaleString()}
                   </p>
                   <p>
                     <span className="font-medium">Expires:</span> {new Date(session.expiresAt).toLocaleString()}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
    )
}
  // <Card>
        //     <CardHeader>
        //         <CardTitle>Recent Sessions</CardTitle>
        //     </CardHeader>
        //     <CardContent>
        //         <p className="text-2xl font-bold mb-2">{user.sessions.length}</p>
        //         <p className="text-sm text-muted-foreground mb-4">Total sessions</p>
        //         <ScrollArea className="h-[200px]">
        //             {user.sessions.map((session) => (
        //                 <div key={session.id} className="mb-4 p-2 bg-secondary rounded-md flex items-center">
        //                     <svg className="w-4 h-4 mr-2 text-green-500 animate-pulse" viewBox="0 0 24 24">
        //                         <circle cx="12" cy="12" r="10" fill="currentColor" />
        //                     </svg>
        //                     <div>
        //                         <p className="text-sm"><strong>IP:</strong> {session.ipAddress}</p>
        //                         <p className="text-sm"><strong>User Agent:</strong> {session.userAgent}</p>
        //                         <p className="text-sm"><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
        //                         <p className="text-sm"><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
        //                     </div>
        //                 </div>
        //             ))}
        //         </ScrollArea>
        //     </CardContent>
        // </Card>