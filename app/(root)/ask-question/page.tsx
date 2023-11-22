"use server";

import Question from "@/components/forms/Question";
import { getUserDetails } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const authUser = auth();
  const clerkId = authUser.userId;

  const user = await getUserDetails({ userId: clerkId });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-8">
        <Question user={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default page;
