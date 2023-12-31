"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "./mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;

    const questionDetails = await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (!existingInteraction) {
        const questionTags = questionDetails.tags.map((tagId: any) =>
          tagId.toString()
        );
        await Interaction.create({
          user: userId,
          action: "view",
          question: questionId,
          tags: questionTags,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
