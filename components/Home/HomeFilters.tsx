"use client";

import React from "react";
import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants/filter";

const HomeFilters = () => {
  const active = "frequent";
  return (
    <div className="mt-5 hidden gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => {}}
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
