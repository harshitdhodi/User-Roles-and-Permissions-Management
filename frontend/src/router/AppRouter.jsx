import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layout/Layout'
import NotFound from '../utils/NotFound'
import Dashboard from '../component/welcome/Dashboard'
import Setting from '../component/welcome/setting/Setting'
import Login from '../component/welcome/login/Login'
import Profile from '../component/welcome/proflie/Profile'
import Users from '../component/users/Users'
import FollowUp from '../component/lead/FollowUp'
import UserDetails from '../component/users/userDetails/UserDetails'
import UserLayout from '@/component/users/UserLayout'
import Permission from '@/component/users/permission/Permission'
import Roles from '@/component/users/roles/Roles'

export const createAppRouter = (isAuthenticated) => createBrowserRouter([
    {
        path: "/",
        element: isAuthenticated ? <RootLayout /> : <Navigate to="/login" />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'users',
                element: <UserLayout />,
                children: [
                    {
                        path: '',
                        element: <Users />
                    },
                    {
                        path: ':id',
                        element: <UserDetails />
                    }
                ],
            },
            {
                path:'permissions',
                element: <Permission />
            },
            {
                path:'roles',
                element: <Roles />
            },
            {
                path: '/sales/deals',
                element: <FollowUp />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'setting',
                element: <Setting />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        path: "/login",
        element: !isAuthenticated ? <Login /> : <Navigate to="/" />
    }
])

