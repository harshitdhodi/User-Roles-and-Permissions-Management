import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useThemeContext } from '@/hooks/color-context'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AvatarDemo from './AvatarDemo'
import { User, Settings, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux' // Import useDispatch
import { clearAllDetails } from '@/store/reducer/authSlice'

export default function PopoverDemo() {
  const { themeColor } = useThemeContext()
  const router = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch() // Initialize dispatch
  const user=useSelector((state)=>state?.auth?.user)
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      dispatch(clearAllDetails())
      // Get the token from cookies
      const token = Cookies.get('token')

      // Perform logout request
      await axios.post('/api/v1/sessions/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Remove token from cookies
      dispatch(clearAllDetails()) // Example: Clear user details state
      Cookies.remove('token')

      // Show success toast
      toast.success("You have been successfully logged out.")

      router('/login')

      // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error)

      // Show error toast
      toast.error("Unable to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(`hover:bg-${themeColor}-100 text-${themeColor}-500`)}
        >
          <AvatarDemo />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(" w-56 mr-16", `border-${themeColor}-200`)}>
        <div className="space-y-4">
          <div className="flex items-center">
            <AvatarDemo />
            <div className="ml-3">
              <p className="text-sm font-medium">{user ? user.firstName + ' ' + user.lastName : 'Name'}</p>
            {user && 
            
             <p className="text-xs text-gray-500">{user.email}</p>
            } 
            </div>
          </div>
          <div className="border-t border-gray-200" />
          <ul className="space-y-1">
            <li>
              <Link to="/profile">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", `hover:bg-${themeColor}-100 hover:text-${themeColor}-500`)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
                </Link>
            </li>
            <li>
            <Link to="/setting">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", `hover:bg-${themeColor}-100 hover:text-${themeColor}-500`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              </Link>
            </li>
          </ul>
          <div className="border-t border-gray-200" />
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoading}
            className={cn("w-full justify-start text-red-500", `hover:bg-red-100 hover:text-red-600`)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
