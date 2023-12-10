import Link from "next/link";
import { formatNumber, formatTime } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Metric from "../Metric";
import EditDeleteActions from "../EditDeleteActions";
import { convert } from "html-to-text";

interface Props {
  clerkId?: string | null;
  _id: string;
  answerContent?: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  answerContent,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {formatTime(createdAt)}
        </span>
        <div className="flex w-full justify-between gap-5">
          <Link href={`/question/${question?._id}/#${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
              {question.title}
            </h3>
          </Link>
          <SignedIn>
            {showActionButtons && (
              <EditDeleteActions type="answer" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>
      </div>
      <p className="text-dark500_light700 my-4 line-clamp-1 text-sm">
        {convert(answerContent!)}
      </p>

      <div className="flex-between mt-5 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` • asked ${formatTime(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatNumber(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
