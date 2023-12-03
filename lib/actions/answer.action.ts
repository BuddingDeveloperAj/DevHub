"use server";

import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { requestHandler } from "../requestHandler";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    const { path, ...rest } = params;
    const newAnswer = await requestHandler({
      url: "/answers",
      method: "post",
      payload: rest,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    const response = await requestHandler({
      url: `/answers/${params.questionId}`,
      method: "get",
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, path, ...rest } = params;

    await requestHandler({
      url: `/answers/${answerId}/upvote`,
      method: "put",
      payload: rest,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, path, ...rest } = params;

    await requestHandler({
      url: `/answers/${answerId}/downvote`,
      method: "put",
      payload: rest,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
