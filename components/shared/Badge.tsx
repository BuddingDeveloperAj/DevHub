import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium text-light400_light500 background-light800_dark300_with_hover rounded-md border-none px-4 py-2 uppercase">
        <p className="max-w-[100px] truncate">{name}</p>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
