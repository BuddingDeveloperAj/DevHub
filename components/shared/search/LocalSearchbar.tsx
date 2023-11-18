"use client";

import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";

interface Props {
  imgSrc: string;
  route: string;
  iconPosition: string;
  placeholder: string;
  otherClasses?: string;
}

const HomeSearch = ({
  imgSrc,
  route,
  iconPosition,
  placeholder,
  otherClasses,
}: Props) => {
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
          className="cursor-pointer"
        />
      )}
      <Input
        placeholder={placeholder}
        type="text"
        onChange={() => {}}
        value=""
        className="placeholder paragraph-regular background-light800_darkgradient no-focus border-none  caret-gray-800 shadow-none outline-none"
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

export default HomeSearch;
