"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

interface Props {
  pageNumber: number;
  isNext: boolean;
  totalPages: number;
}

const Pagination = ({ pageNumber, isNext, totalPages }: Props) => {
  const [inputPageValue, setInputPageValue] = useState(pageNumber);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setInputPageValue(pageNumber);
  }, [pageNumber]);

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: e.target.value,
      });
      router.push(newUrl);
    }
  };

  const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number
  ): ((...args: Parameters<F>) => void) => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: Parameters<F>) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandlePagination = useCallback(
    debounce(
      (direction: string) => {
        const nextPageNumber =
          direction === "prev" ? pageNumber - 1 : pageNumber + 1;

        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "page",
          value: nextPageNumber.toString(),
        });

        router.push(newUrl);
      },
      300 // Set the delay time in milliseconds (adjust as needed)
    ),
    [pageNumber, router, searchParams]
  );

  if (totalPages === 1) {
    return <></>;
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => debouncedHandlePagination("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>

      <Input
        className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 w-16 text-center"
        type="number"
        value={inputPageValue}
        min="1"
        max={totalPages}
        onChange={(e) => setInputPageValue(+e.target.value)}
        onKeyDown={handleEnterPress}
      />

      <Button
        disabled={!isNext}
        onClick={() => debouncedHandlePagination("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border bg-gray-800"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
