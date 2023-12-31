"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  imgSrc: string;
  route: string;
  iconPosition: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  imgSrc,
  route,
  iconPosition,
  placeholder,
  otherClasses,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }

      return () => clearTimeout(debouncedSearch);
    }, 300);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px]  items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer "
        />
      )}
      <Input
        placeholder={placeholder}
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="placeholder paragraph-regular text-dark400_light700 no-focus border-none  bg-transparent caret-gray-800 shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
