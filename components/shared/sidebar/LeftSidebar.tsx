"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";

const LeftSidebar = () => {
  const pathName = usePathname();
  const { userId } = useAuth();

  // TODO profile page

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-4 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[300px]">
      <div>
        {sidebarLinks.map((item) => {
          const isActive =
            (pathName.includes(item.route) && item.route.length > 1) ||
            pathName === item.route;

          if (item.route === "/profile") {
            if (userId) {
              item.route = `${item.route}/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <Link
              href={item.route}
              key={item.route}
              title={item.label}
              className={`mb-2 flex items-center justify-start gap-4 bg-transparent p-4 ${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900 hover:rounded-lg hover:bg-orange-50 dark:hover:bg-gray-900"
              }`}
            >
              <Image
                className={`${isActive ? "" : "invert-colors"}`}
                src={item.imgURL}
                width={20}
                height={20}
                alt={item.label}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in" className="mt-6" title="sign In">
            <Button className="small-medium btn-secondary light-border min-h-[41px] w-full rounded-lg px-4 py-3 text-primary-500 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                alt="sign in"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
          <Link href="/sign-up" title="sign Up">
            <Button className="small-medium btn-tertiary light-border-2 text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                alt="sign in"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Sign Up
              </span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
