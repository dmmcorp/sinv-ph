"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import MobileNavigation from "../../mobile-navigation";
import { FileBox, LayoutDashboardIcon, Receipt, Users } from "lucide-react";
import UserAvatar from "../../user-avatar";
import Link from "next/link";

function NavBar() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full flex items-center justify-between py-3">
      <div className="logo flex items-center gap-2">
        <div className="size-10 rounded-full bg-black "></div>
        <h2>SINV PH</h2>
      </div>
      <div className="navtab hidden lg:block  w-fit px-10 rounded-full ">
        <ul className="flex items-start justify-evenly gap-y-2 ">
          <Link href={"/subscriber"}>
            <li className="flex items-center gap-2 px-5 py-4 ">
              <LayoutDashboardIcon />
              Dashboard
            </li>
          </Link>
          <li className="flex items-center gap-2 px-5 py-4  ">
            <Receipt />
            Invoices
          </li>
          <li className="flex items-center gap-2 px-5 py-4 ">
            <Users />
            Clients
          </li>
          <li className="flex items-center gap-2 px-5 py-4  text-nowrap">
            <FileBox /> Items & Services
          </li>
        </ul>
      </div>
      <div className="hidden lg:block ">
        <UserAvatar />
      </div>
      <div className="block lg:hidden">
        {isMobile ? (
          <div className="">
            <MobileNavigation />
          </div>
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
