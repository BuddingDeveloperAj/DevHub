"use server";

import Question from "@/components/forms/Question";
import { getUserDetails } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const clerkId = "123456";

  const user = await getUserDetails(clerkId);
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
