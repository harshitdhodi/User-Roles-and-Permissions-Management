'use client'

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from '@/store/api/userSliceApi'
import BreadcrumbDemo from './BreadcrumbDemo'
import UserProfile from './UserProfile'
import RecentSessions from './RecentSessions'
import RecentActivity from './RecentActivity'
import Permissions from './Permissions'



export default function UserDetails() {
    const { id } = useParams()
    const { data: userData, isLoading, error } = useGetUserByIdQuery(id);
   
    const user = userData // In a real app, you'd fetch this based on the id

   
    if (user && isLoading && error) {
        return <p>..loading</p>
    }

    return (
        <div className=" mx-auto   bg-inherit">
            {user &&
                <>
                    <BreadcrumbDemo user={user} />
                    {/* <div className="grid grid-cols-1 md:grid-cols-2  mt-4 px-5 mb-3"> */}
                        <UserProfile user={user} />
                        {/* <RecentActivity user={user} /> */}
                    {/* </div> */}
                </>
            }
        </div>
    )
}









