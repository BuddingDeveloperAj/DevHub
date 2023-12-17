import React from "react";
import Link from "next/link";
import RenderTag from "../Badge";
import Metric from "../Metric";
import { formatNumber, formatTime } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteActions from "../EditDeleteActions";

interface QuestionProps {
  _id: string;
  title: string;
  clerkId?: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    clerkId: string;
    picture: string;
  };
  views: number;
  answers: Array<object>;
  upvotes: number;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  answers,
  views,
  upvotes,
  createdAt,
  clerkId,
}: QuestionProps) => {
  const showActions = clerkId && clerkId === author.clerkId;

  const cardContent = (
    <div className="card-wrapper rounded-[10px] p-9 shadow-xl sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {formatTime(createdAt)}
        </span>
        <div className="flex w-full justify-between gap-5">
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 max-sm:line-clamp-2">
              {title}
            </h3>
          </Link>
          <SignedIn>
            {showActions && (
              <EditDeleteActions type="question" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` • asked ${formatTime(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          value={formatNumber(views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );

  return <>{cardContent}</>;
};

export default QuestionCard;
