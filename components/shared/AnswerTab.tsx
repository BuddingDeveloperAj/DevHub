import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "./cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
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
    </div>
  );
};

export default AnswerTab;
