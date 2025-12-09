"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FileBox,
  LayoutDashboardIcon,
  LogOut,
  Menu,
  Receipt,
  Users,
} from "lucide-react";

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <ul className="flex flex-col items-start justify-evenly gap-y-2">
            <li className="flex items-center gap-2 px-2 py-4  w-full">
              <LayoutDashboardIcon />
              Dashboard
            </li>
            <li className="flex items-center gap-2 px-2 py-4  w-full">
              <Receipt />
              Invoices
            </li>
            <li className="flex items-center gap-2 px-2 py-4  w-full">
              <Users />
              Clients
            </li>
            <li className="flex items-center gap-2 px-2 py-4  w-full">
              <FileBox /> Items & Services
            </li>
          </ul>
        </div>
        <SheetFooter>
          <Button type="button" variant={"outline"}>
            {" "}
            <LogOut /> Sign out{" "}
          </Button>
          {/* <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
