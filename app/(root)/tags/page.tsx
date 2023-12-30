import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filter";
import React from "react";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getAllTags } from "@/lib/actions/tags.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Tags: Find Relevant Questions | DevHub",
  description: `Browse through tags on DevHub to discover a range of topics. Click on a tag to explore related 
  questions, dive deep into discussions, and find valuable insights.`,
};

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags..."
          iconPosition="left"
          route="/tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap justify-start gap-4 max-md:flex-col">
        {result!.tags.length > 0 ? (
          result!.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="background-light900_dark200 light-border rounded-2xl border px-8 py-10 shadow-lg hover:shadow-orange-100 dark:hover:shadow-gray-800 sm:w-[240px]"
            >
              <article className="  flex w-full flex-col ">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5 ">
                  <p className="paragraph-semibold text-dark300_light900 capitalize">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light700 my-3.5">
                  {tag.description || ""}
                </p>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>{" "}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>
      <div className="mt-10">
        {result!.tags?.length > 0 ? (
          <Pagination
            pageNumber={searchParams.page ? +searchParams.page : 1}
            isNext={result!.isNext ?? false}
            totalPages={result!.totalPages ?? 1}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Tags;
