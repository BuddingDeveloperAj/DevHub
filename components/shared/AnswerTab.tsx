import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "./cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <div className="mt-6 flex w-full flex-col gap-6">
      {result?.answers.length
        ? result.answers.map((answer) => (
            <AnswerCard
              answerContent={answer.content}
              key={answer._id}
              clerkId={clerkId}
              _id={answer._id}
              question={answer.question}
              author={answer.author}
              upvotes={answer.upvotes.length}
              createdAt={answer.createdAt}
            />
          ))
        : ""}
      <div className="mt-10">
        {result!.answers?.length > 0 ? (
          <Pagination
            pageNumber={searchParams.page ? +searchParams.page : 1}
            isNext={result?.isNext ?? false}
            totalPages={result?.totalPages! ?? 1}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AnswerTab;
