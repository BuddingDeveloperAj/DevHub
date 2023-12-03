"use server";

import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  GetQuestionsParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
} from "./shared.types";
import { requestHandler } from "../requestHandler";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    const { path, ...rest } = params;
    await requestHandler({
      url: "/questions",
      method: "POST",
      payload: rest,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const response = await requestHandler({
      url: "/questions",
      method: "get",
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    const questionId = params.questionId;
    const response = await requestHandler({
      url: `/questions/${questionId}`,
      method: "GET",
    });
    return response.data.data.question;
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, path, ...rest } = params;

    await requestHandler({
      url: `/questions/${questionId}/upvote`,
      method: "put",
      payload: rest,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, path, ...rest } = params;

    await requestHandler({
      url: `/questions/${questionId}/downvote`,
      method: "put",
      payload: rest,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
