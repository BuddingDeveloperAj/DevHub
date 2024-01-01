import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTags } from "@/lib/actions/tags.action";
import { Badge } from "@/components/ui/badge";
import RenderTag from "../Badge";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="background-light900_dark200 light-border w-full rounded-2xl border shadow-md transition-shadow hover:shadow-xl dark:shadow-slate-900 max-xs:min-w-full xs:w-[210px]"
    >
      <div className="  flex w-full flex-col justify-start p-4">
        <Image
          src={user.picture}
          alt="User Profile"
          width={75}
          height={75}
          className="self-center rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5 w-full">
          <div className="flex w-full flex-row flex-wrap justify-center gap-2">
            {interactedTags?.length ? (
              interactedTags?.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))
            ) : (
              <Badge className="subtle-medium text-light400_light500 background-light800_dark300_with_hover rounded-md border-none px-4 py-2 uppercase">
                No tags yet
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
