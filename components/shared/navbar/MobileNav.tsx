"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathName = usePathname();

  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathName.includes(item.route) && item.route.length > 1) ||
          pathName === item.route;
        return (
          <SheetClose asChild key={item.route}>
            <Link
              className={`flex items-center justify-start gap-4 bg-transparent p-4 ${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }`}
              href={item.route}
            >
              <Image
                className={`${isActive ? "" : "invert-colors"}`}
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          className="invert-colors sm:hidden"
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/images/devHub_logo.svg"
            width={30}
            height={30}
            alt="DevHub"
          />
          <p className="h2-bold text-dark100_light900 pl-2">
            Dev<span className="text-primary-500">Hub</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in" className="mt-6">
                  <Button className="small-medium btn-secondary light-border min-h-[41px] w-full rounded-lg px-4 py-3 text-primary-500 shadow-none">
                    Log In
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium btn-tertiary light-border-2 text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
