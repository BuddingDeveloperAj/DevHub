import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filter";
import React from "react";
import Filter from "@/components/shared/Filter";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/shared/cards/UserCard";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore the DevHub Community | Find and Connect with Developers",
  description: `Discover and connect with a diverse community of developers at DevHub. Filter and search 
  through user profiles to build connections, collaborate, and grow together.`,
};

const Community = async ({ searchParams }: SearchParamsProps) => {
  const result = (await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })) ?? { users: [], totalPages: 1, isNext: false };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for peers..."
          iconPosition="left"
          route="/community"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-5 max-sm:justify-center">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p className="mb-4 mt-2 font-bold">No Geeks Found 💻</p>
            <Link
              href="/sign-up"
              className="h3-bold primary-text-gradient font-bold"
            >
              Start the Community! Be the First to Join!
            </Link>
          </div>
        )}
      </section>
      <div className="mt-10">
        {result?.users?.length > 0 ? (
          <Pagination
            pageNumber={searchParams.page ? +searchParams.page : 1}
            isNext={result?.isNext ?? false}
            totalPages={result?.totalPages! ?? 1}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Community;
