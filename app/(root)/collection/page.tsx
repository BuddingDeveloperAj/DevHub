import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filter";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { getSavedQuesions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Saved Content | DevHub",
  description: `Access your saved posts, answers, and questions at DevHub. Easily retrieve and organize your 
  curated content to continue learning and refining your projects.`,
};

export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }
  const result = await getSavedQuesions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  const questions = result?.questions ?? [];

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          iconPosition="left"
          route="/collection"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

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
            title="There's no saved question to show"
            description="Currently, there are no saved questions available. Feel free to save your inquiries for later or explore new ones by asking a question now!"
            link="/ "
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        {questions.length > 0 ? (
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
