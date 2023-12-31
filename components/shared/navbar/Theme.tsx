"use client";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { themes } from "@/constants";

const Theme = () => {
  const { mode, setMode } = useTheme();
  return (
    <div>
      <Menubar className="relative border-none shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="focus:bg-light-900 data-[state=opne]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
            {mode === "dark" ? (
              <Image
                src="/assets/icons/moon.svg"
                alt="moon"
                width={20}
                height={20}
                className="active-theme"
              />
            ) : (
              <Image
                src="/assets/icons/sun.svg"
                alt="sun"
                width={20}
                height={20}
                className="active-theme"
              />
            )}
          </MenubarTrigger>
          <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-white py-2 dark:border-dark-400 dark:bg-dark-300">
            {themes.map((theme) => {
              return (
                <MenubarItem
                  key={theme.value}
                  onClick={() => {
                    setMode(theme.value);
                    if (theme.value !== "system") {
                      localStorage.theme = theme.value;
                    } else {
                      localStorage.removeItem("theme");
                    }
                  }}
                  className="flex cursor-pointer items-center gap-4 px-2.5 py-2 hover:bg-gray-100 dark:border-dark-400 dark:bg-dark-300 dark:hover:bg-gray-800"
                >
                  <Image
                    className={`${mode === theme.value && `active-theme`}`}
                    src={theme.icon}
                    width={15}
                    height={15}
                    alt="themeIcon"
                  />
                  <p
                    className={`body-semibold text-light-500 ${
                      mode === theme.value
                        ? "text-primary-500"
                        : "text-dark100_light900"
                    }`}
                  >
                    {theme.label}
                  </p>
                </MenubarItem>
              );
            })}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Theme;
