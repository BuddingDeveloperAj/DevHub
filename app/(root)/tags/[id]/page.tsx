import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { getQuestionsByTagId } from "@/lib/actions/tags.action";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import React from "react";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = (await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  })) ?? { questions: [], tagTitle: "" };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">
        {result.tagTitle}
      </h1>
      <div className="mt-5 w-full">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          iconPosition="left"
          route={`/tags/${params.id}`}
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="There's no tag question to show"
            description="Currently, there are no tag questions available. Feel free to save your inquiries for later or explore new ones by asking a question now!"
            link="/ "
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
