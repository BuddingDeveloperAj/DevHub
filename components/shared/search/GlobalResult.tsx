import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

interface Result {
  title: string;
  type: string;
  _id: string;
}

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result[]>([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);

      try {
        const res: any = await globalSearch({
          query: global,
          type,
        });
        const parsedResult: Result[] = JSON.parse(res);
        setResult(parsedResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global, type]);

  const LinkMapper = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tag/${id}`;
      default:
        return `/`;
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl border border-gray-300 bg-light-800 py-5 shadow-sm dark:border-gray-500 dark:bg-dark-400">
      <p className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </p>
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-6 w-6 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={LinkMapper(item.type, item.id)}
                  key={item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-lg px-5 py-2 hover:bg-light-700/80 dark:hover:bg-gray-900/70"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>

                    <p className="text-light400_light500 mt-1 text-[8px] font-semibold uppercase">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, No Result Found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
