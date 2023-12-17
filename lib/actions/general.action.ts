"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "./mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { Model } from "mongoose";

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const searchableType = ["question", "answer", "tag", "user"];

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    const results = [];

    const modelsAndType = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
    ];

    const typeLower = type?.toLowerCase();

    const getQueryReults = async (
      model: Model<any>,
      searchField: string,
      type: string,
      limit: number
    ) => {
      let queryResults;
      if (type === "answer") {
        queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .populate({
            path: "question",
            model: Question,
            select: "_id title",
          })
          .limit(limit);
      } else {
        queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(limit);
      }

      return queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing (${query}) in Question ${item.question.title}`
            : item[searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question._id
            : item._id,
      }));
    };

    if (!typeLower || !searchableType.includes(typeLower)) {
      for (const { model, searchField, type } of modelsAndType) {
        const queryResults = await getQueryReults(model, searchField, type, 2);

        results.push(...queryResults);
      }
    } else {
      const modelInfo = modelsAndType.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await getQueryReults(
        modelInfo.model,
        modelInfo.searchField,
        modelInfo.type,
        8
      );

      results.push(...queryResults);
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(Error);
    throw error;
  }
}
