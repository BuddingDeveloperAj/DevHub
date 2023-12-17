"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);
    setSearch("");

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (!query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }

      return () => clearTimeout(debouncedSearch);
    }, 300);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder=" Search globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) {
              setIsOpen(true);
            }

            if (e.target.value === "" && isOpen) {
              setIsOpen(false);
            }
          }}
          className="paragraph-regular no-focus background-light800_darkgradient text-dark400_light700 border-none caret-gray-800 shadow-none outline-none placeholder:text-gray-600 dark:caret-slate-100"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
