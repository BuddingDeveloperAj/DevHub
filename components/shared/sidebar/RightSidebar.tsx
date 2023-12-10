import Link from "next/link";
import Image from "next/image";
import React from "react";
import RenderTag from "../Badge";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tags.action";

const RightSidebar = async () => {
  const popularTags = await getPopularTags();
  const topQuestions = await getHotQuestions();

  return (
    <section
      className="background-light900_dark200
     light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] 
     flex-col overflow-y-auto border-l p-4 pt-36 shadow-light-300 
     dark:shadow-none max-xl:hidden"
    >
      <div className="pt-3">
        <h3 className="h2-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-3">
          {topQuestions!.map((item) => {
            return (
              <Link
                href={`/question/${item._id}`}
                key={JSON.parse(JSON.stringify(item._id))}
                className="flex cursor-pointer items-center justify-between gap-7 rounded-lg p-2 hover:bg-orange-50 dark:hover:bg-gray-900"
              >
                <p className="body-medium text-dark500_light700">
                  {item.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-20">
        <h3 className="h2-bold text-dark300_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-2">
          {popularTags!.map((item) => {
            return (
              <RenderTag
                key={item._id}
                _id={item._id}
                name={item.name}
                showCount
                totalQuestions={item.totalQuestions}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
