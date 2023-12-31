import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import type { Metadata } from "next";
// import LoginHeatMap from "@/components/shared/HeatMap";

export const metadata: Metadata = {
  title: "Your Developer Profile | DevHub",
  description: `Your personalized developer profile on DevHub. Showcase your skills, contributions, and 
  projects. Connect with peers, share insights, and foster meaningful collaborations.`,
};

const page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });
  const { userId: clerkId } = auth();

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="text-dark300_light900 flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user?.picture}
            alt="profile pic"
            width={140}
            height={140}
            className="my-auto rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo?.user?.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo?.user?.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo?.user?.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  title="Portfolio"
                  href={userInfo?.user?.portfolioWebsite}
                />
              )}

              {userInfo?.user?.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo?.user?.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${moment(userInfo?.user?.joinedAt).format(
                  "MMMM YYYY"
                )}`}
              />
            </div>
            {userInfo?.user?.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo?.user?.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo?.user.clerkId && (
              <Link href={`/profile/${userInfo.user.clerkId}/edit`}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px]  px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo?.totalQuestions ?? 0}
        totalAnswers={userInfo?.totalAnswers ?? 0}
        badgeCounts={userInfo!.badgeCounts}
      />

      {/* <div className="mt-5">
        <LoginHeatMap />
      </div> */}

      <div className="mt-6 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              clerkId={clerkId!}
              userId={userInfo?.user.id}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              searchParams={searchParams}
              clerkId={clerkId!}
              userId={userInfo?.user.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
