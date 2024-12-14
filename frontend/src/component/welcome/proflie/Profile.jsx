import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  CalendarDays,
  Mail,
  ShieldCheck,
  Activity,
  Key,
  MapPin,
  Clock,
  Layers,
  LogInIcon,
  Globe,
  MapPinned
} from 'lucide-react';
import { useThemeContext } from '@/hooks/color-context';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import LoginDevices from './LoginDevices';
import RecentActivity from './RecentActivity';
import ImageUploader from './ImageUploader';

const CreativeProfileView = () => {
  const user = useSelector((state) => state.auth?.user);
  const { themeColor } = useThemeContext();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return <div className="text-center text-gray-500 p-8">Loading profile...</div>;
  const img = useSelector((state) => state.auth?.user?.img)

  const color = () => {
    return `from-${themeColor}-500 to-${themeColor}-900`
  }
  // Calculate user account age
  const accountAge = () => {
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group activities by type


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      {themeColor &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${color} from-blue-500 to-blue-900 p-6 text-white`}>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white">
                <Avatar>
                  <AvatarImage src={`http://localhost:5000${img}`} alt="@shadcn" />
                  <AvatarFallback className={`${color()} text-${themeColor}-500`}>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-sm opacity-80 flex items-center">
                  <ShieldCheck className="mr-2" size={16} />
                  {user.role?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-500" size={20} />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDays className="text-green-500" size={20} />
                  <span className="text-gray-700">
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-purple-500" size={20} />
                  <span className="text-gray-700">
                    Account Age: {accountAge()} days
                  </span>
                </div>
              </div>

              <ImageUploader/>
            </div>
          </div>
          
          {user &&
            <>
              <LoginDevices user={user} />
              <RecentActivity user={user} />
            </>

          }

          {/* RecentActivity Timeline */}

        </motion.div>
      }

    </div>
  );
};

export default CreativeProfileView;