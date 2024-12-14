import { Slash } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";



export default function BreadcrumbComp({ items }) {
  return (
    <Breadcrumb className=" pl-2 pb-5">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
            <Link to={item.path}>
          
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
              )}
                </Link>
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
