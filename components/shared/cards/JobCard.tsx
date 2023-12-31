"use client";

import Image from "next/image";
import React from "react";
import moment from "moment";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface JobProps {
  name: string;
  company: string;
  location: string;
  date: string;
  jobUrl: string;
}

const JobCard = (props: JobProps) => {
  const { name, jobUrl, company, location, date } = props;
  return (
    <div className="card-wrapper flex min-h-[180px] items-center justify-between gap-10 rounded-[10px] p-9 shadow-md hover:shadow-lg dark:hover:shadow-gray-900 max-md:flex-col">
      <div className="flex w-full justify-start gap-10">
        <Image
          src="/assets/icons/suitcase.svg"
          width={100}
          height={100}
          alt="company logo"
          className="rounded-md bg-orange-300 p-5 dark:bg-dark-400 max-sm:hidden"
        />

        <div className="w-full">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex">
            Posted {formatTime(moment(date).toDate())}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 max-sm:line-clamp-2">
            {name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            Posted By {company}
          </p>
          <p className="body-regular text-dark500_light500">{location}</p>
        </div>
      </div>
      <div className="flex items-start justify-start">
        <a target="_blank" href={jobUrl} className="w-full">
          <Button className="primary-gradient w-fit !text-light-900">
            Apply for Job
          </Button>
        </a>
      </div>
    </div>
  );
};

export default JobCard;
