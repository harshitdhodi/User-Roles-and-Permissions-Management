import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from 'react-router-dom'
export default function BreadcrumbDemo({ user }) {
    return (
        <Breadcrumb className=" text-lg font-mono cursor-pointer">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link  className=" text-md font-mono"  to="/users">Users</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage  className=" text-lg font-mono">{user.firstName + ' ' + user.lastName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
