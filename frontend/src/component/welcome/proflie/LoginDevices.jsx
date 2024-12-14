
import React from 'react';
import { motion } from 'framer-motion';

import {

  LogInIcon,
  Globe,

} from 'lucide-react';

import { useSelector } from 'react-redux';

export default function LoginDevices() {
    const user = useSelector((state) => state.auth?.user);
  return (
    <div>
          {/* Login Devices Section */}
       <div className="bg-gray-50 p-6">
         <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
           <LogInIcon className="mr-3 text-green-600" size={24} />
           Login Devices & Recent Sessions
         </h2>
         <div className="space-y-3">
           {user.recentSessions &&user.recentSessions?.slice(0, 5).map((session, index) => {
             // Simple device detection logic
             const isMobile = session.userAgent.includes('Mobile');
             const isDesktop = !isMobile;

             return (
               <motion.div
                 key={session.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
               >
                 <div className="flex justify-between items-center">
                   <div className="flex items-center space-x-3">
                     {isMobile ? (
                       <LogInIcon className="text-blue-500" size={20} />
                     ) : (
                       <Globe className="text-purple-500" size={20} />
                     )}
                     <div>
                       <p className="font-medium text-gray-800">
                         {isMobile ? 'Mobile Device' : 'Desktop Login'}
                       </p>
                       <p className="text-sm text-gray-600">
                         IP: {session.ipAddress}
                       </p>
                       <p className="text-xs text-gray-500">
                         {session.userAgent}
                       </p>
                     </div>
                   </div>
                   <div className="text-sm text-gray-500 text-right">
                     {session.createdAt}
                   </div>
                 </div>
               </motion.div>
             );
           })}
         </div>
       </div>
    </div>
  )
}
