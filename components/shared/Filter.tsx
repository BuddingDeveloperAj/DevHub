"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter");

  const handleUPdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`${containerClasses}`}>
      <Select
        onValueChange={(value) => handleUPdateParams(value)}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="background-light900_dark200">
            {filters.map((filter) => (
              <SelectItem
                className={`text-dark300_light700 cursor-pointer ${
                  paramFilter === filter.value
                    ? "bg-orange-200/50 dark:bg-gray-800/60"
                    : "hover:bg-orange-100/20 dark:hover:bg-gray-900"
                }`}
                key={filter.value}
                value={filter.value}
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
