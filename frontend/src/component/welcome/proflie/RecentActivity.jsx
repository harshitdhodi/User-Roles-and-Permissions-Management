import React from 'react';
import { motion } from 'framer-motion';
import {

    Activity,

} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function RecentActivity() {
    const user = useSelector((state) => state.auth?.user);
    return (
        <div>
            <div className="bg-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                    <Activity className="mr-3 text-blue-600" size={24} />
                    Recent Activity Timeline
                </h2>
                <div className="space-y-3">
                    {user.recentActivityLogs&& user.recentActivityLogs?.slice(0, 5).map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">{log?.activityType}</p>
                                    <p className="text-sm text-gray-600">{log?.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {log?.createdAt || ''}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
