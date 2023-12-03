import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filter";
import HomeFilters from "@/components/Home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

export default async function Home() {
  const result = await getQuestions({});
  const questions = result?.questions ?? [];

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder=" Search for Questions"
          iconPosition="left"
          route="/"
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
            description="Join the conversation! Break the silence and ask the first question. Be
          the trendsetter in our community."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
