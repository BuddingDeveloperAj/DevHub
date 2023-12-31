import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearchbar from "../search/GlobalSearchbar";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/devHub_logo.svg"
          width={40}
          height={40}
          alt="DevHub"
          className="rounded-full"
        ></Image>
        <p className=" h1-bold px-2 text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Hub</span>
        </p>
      </Link>
      <GlobalSearchbar />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
