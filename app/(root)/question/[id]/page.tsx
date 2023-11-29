import { getQuestionById } from "@/lib/actions/question.action";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import { formatNumber, formatTime } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/Badge";
import Answer from "@/components/forms/Answer";
import { SignedIn, auth } from "@clerk/nextjs";
import { getUserDetails } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

const page = async ({ params }: any) => {
  const result = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();
  let user;

  if (clerkId) {
    user = await getUserDetails({ userId: clerkId });
    console.log(user);
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result?.author?.clerkId!}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result?.author?.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700 ">
              {result.author.name}
            </p>
          </Link>
          <Votes
            type="question"
            itemId={JSON.stringify(result._id)}
            userId={JSON.stringify(user._id)}
            upvotes={result.upvotes.length}
            hasUpvoted={result.upvotes.includes(user._id)}
            downvotes={result.downvotes.length}
            hasDownvoted={result.downvotes.includes(user._id)}
            hasSaved={user.saved.includes(result._id)}
          />
        </div>
        <h1 className="h2-semibold text-dark200_light900 mt-3.5 self-start">
          {result?.title}
        </h1>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="Views"
          value={`asked ${formatTime(result.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          value={formatNumber(result.views.length)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Views"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <div className="text-dark200_light900">
        <ParseHTML data={result.content} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <div className="mt-10">
        <SignedIn>
          <Answer
            authorId={JSON.stringify(user?._id)}
            questionId={JSON.stringify(result?._id)}
          />
        </SignedIn>
      </div>
      <div>
        <AllAnswers
          questionId={JSON.stringify(result?._id)}
          userId={JSON.stringify(user?._id)}
          totalAnswers={result.answers?.length}
        />
      </div>
    </>
  );
};

export default page;
