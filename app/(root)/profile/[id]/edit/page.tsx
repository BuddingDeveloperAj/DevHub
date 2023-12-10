import React from "react";
import { getUserDetails } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Profile from "@/components/forms/Profile";
import NoResult from "@/components/shared/NoResult";

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;

  if (userId !== params.id)
    return (
      <NoResult
        title="Don't Try To Edit Other's Profile"
        link={`/profile/${userId}`}
        linkTitle="My Profile"
        description="You're not authorized to edit other users' profiles."
      />
    );

  const mongoUser = await getUserDetails({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile
          clerkId={JSON.stringify(mongoUser._id)}
          user={JSON.stringify(mongoUser)}
        />
      </div>
    </>
  );
};

export default page;
