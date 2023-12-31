"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants/filter";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const [active, setActive] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterClick = (item: string) => {
    if (item === active) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-5 hidden gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => {
            handleFilterClick(item.value);
          }}
          key={item.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-orange-200 text-primary-500 "
              : "bg-light-800 text-light-500 hover:bg-orange-100 dark:bg-dark-300 dark:hover:bg-gray-800"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
