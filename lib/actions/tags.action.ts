"use server";

import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { requestHandler } from "../requestHandler";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    const { userId } = params;
    console.log(params, 123);
    const response = await requestHandler({
      url: `/tags/top/${userId}`,
      method: "get",
    });

    return response.data.data.tags;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    const response = await requestHandler({
      url: `/tags`,
      method: "get",
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
