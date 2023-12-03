import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filter";
import React from "react";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getAllTags } from "@/lib/actions/tags.action";

const Tags = async () => {
  const result = (await getAllTags({})) ?? { tags: [] };
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder=" Search for tags..."
          iconPosition="left"
          route="/tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap justify-start gap-6 max-md:flex-col">
        {result.tags.length > 0 ? (
          result.tags.map((tag: any) => (
            <Link href={`/tags/${tag._id}`} key={tag._id} className="shadow-md">
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[240px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5 ">
                  <p className="paragraph-semibold text-dark300_light900 capitalize">
                    {tag.name}
                  </p>
                </div>
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
    </>
  );
};

export default Tags;
