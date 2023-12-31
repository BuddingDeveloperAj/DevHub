import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filter";
import HomeFilters from "@/components/Home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Welcome to DevHub: Your Developer Community Hub",
  description: `Discover a vibrant developer community at DevHub – your ultimate resource for connecting, learning, 
  and collaborating. Stay updated on cutting-edge trends, tools, and tech news while growing your skills 
  alongside fellow developers.`,
};

export default async function Home({ searchParams }: SearchParamsProps) {
  let result;
  const { userId } = auth();

  if (searchParams.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        totalPages: 1,
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  const questions = result?.questions ?? [];

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href="/ask-question"
          className="flex justify-end max-sm:my-2 max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] w-full px-4 py-3 !text-light-900 ">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          iconPosition="left"
          route="/"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:block"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Join the conversation! Break the silence and ask the first question. Be
          the trendsetter in our community."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        {result && result?.questions?.length > 0 ? (
          <Pagination
            pageNumber={searchParams.page ? +searchParams.page : 1}
            isNext={result?.isNext ?? false}
            totalPages={result?.totalPages! ?? 1}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
