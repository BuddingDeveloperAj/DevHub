import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {
  JobTypesFilter,
  JobsExperienceFilters,
  JobsLocationTypeFilters,
} from "@/constants/filter";
import NoResult from "@/components/shared/NoResult";
import { SearchParamsProps } from "@/types";
import type { Metadata } from "next";
import LocationSearchbar from "@/components/shared/search/LocationSearchbar";
import JobCard from "@/components/shared/cards/JobCard";
import { getJobs } from "@/lib/actions/job.action";

export const jobMetadata: Metadata = {
  title: "Find Jobs | DevHub",
  description: `Explore and apply for diverse job opportunities on DevHub. Discover roles tailored to your 
    skills and interests, and take the next step in your career journey.`,
};
console.log(process.env.GOOGLE_API_KEY);
export default async function Jobs({ searchParams }: SearchParamsProps) {
  const jobs = await getJobs({
    keyword: searchParams.q || "software engineer",
    location: searchParams.location,
    jobType: searchParams.job_type,
    locationType: searchParams.location_type,
    experience: searchParams.experience,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by title..."
          iconPosition="left"
          route="/collection"
          otherClasses="flex-1"
        />
        <LocationSearchbar
          imgSrc="/assets/icons/location.svg"
          placeholder="Search for Location..."
          iconPosition="left"
          route="/collection"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-5 flex justify-start gap-5 max-sm:flex-col sm:items-center">
        <Filter
          filterId="location_type"
          placeholder="Select Location Type"
          filters={JobsLocationTypeFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        <Filter
          filterId="experience"
          placeholder="Select Experience"
          filters={JobsExperienceFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        <Filter
          filterId="job_type"
          placeholder="Select Job Type"
          filters={JobTypesFilter}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6">
          {jobs.map((job: any, index: number) => (
            <JobCard
              key={index}
              name={job.position}
              company={job.company}
              location={job.location}
              date={job.date}
              jobUrl={job.jobUrl}
            />
          ))}
        </div>
      ) : (
        <NoResult
          title="There's no jobs for the applied filter"
          description="Currently, there are no jobs available."
          link="/"
          linkTitle="Ask a Question"
        />
      )}
    </>
  );
}
