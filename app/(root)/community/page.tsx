import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filter";
import React from "react";
import Filter from "@/components/shared/Filter";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/shared/cards/UserCard";
import { SearchParamsProps } from "@/types";

const Community = async ({ searchParams }: SearchParamsProps) => {
  const result = (await getAllUsers({
    searchQuery: searchParams.q,
  })) ?? { users: [] };

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
    </>
  );
};

export default Community;
