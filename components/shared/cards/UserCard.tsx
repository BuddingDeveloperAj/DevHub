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
      className="w-full rounded-xl shadow-md transition-shadow hover:shadow-lg dark:shadow-slate-900 max-xs:min-w-full  xs:w-[220px]"
    >
      <div className="background-light900_dark200 light-border flex w-full flex-col justify-center rounded-2xl border p-8">
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

        <div className="mt-5">
          {interactedTags?.length ? (
            <div className="flex justify-center gap-2">
              {interactedTags?.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
