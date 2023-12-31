"use server";
import linkedIn from "linkedin-jobs-api";
import { GetJobsParams } from "./shared.types";

export const getJobs = async (params: GetJobsParams) => {
  try {
    const { keyword, location, jobType, locationType, experience } = params;

    const queryOptions = {
      keyword: keyword || "software engineer",
      location: location || "India",
      dateSincePosted: "past Week",
      jobType: jobType || "full time",
      remoteFilter: locationType || "remote",
      experienceLevel: experience || "entry level",
      limit: "20",
    };

    const response = await linkedIn.query(queryOptions);
    return response;
  } catch (error) {
    return [];
  }
};
