"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "./mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDatabase();
    const { content, author, question, path } = params;

    const newAnwer = await Answer.create({
      content,
      author,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnwer._id },
    });

    // TODO: to add reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    await connectToDatabase();

    const answers = await Answer.find({ question: params.questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
  }
};
