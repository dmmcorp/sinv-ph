"use client";
import MobileNavigation from "@/components/mobile-navigation";
import SinvphLogo from "@/components/sinvph-logo";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

function NavBar() {
  const isMobile = useIsMobile();
  return (
    <div className="fixed  w-full px-5 lg:px-10 mx-auto  flex items-center justify-between py-5 bg-white/80 backdrop-blur-md z-50">
      <div className="logo flex items-center gap-2">
    <SinvphLogo />
      </div>
      <div className="navtab hidden lg:block  w-fit px-10 rounded-full ">
        <div className="flex items-start justify-evenly gap-x-10 text-sm text-primary/80 ">
          <Link href={"/"} className=" py-1 hover:text-primary ">
              Home
          </Link>
           <Link href={"/"} className=" py-1 hover:text-primary">
           
            Features
           </Link>
            <Link href={"/"} className=" py-1 hover:text-primary">
           
            Pricing
           </Link>
            <Link href={"/"} className=" py-1 hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
      <div className="hidden lg:block ">
        <Button>Create Invoice</Button>
      </div>
      <div className="block lg:hidden">
        {isMobile ? (
          <div className="">
            {/* <MobileNavigation /> */}
          </div>
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
