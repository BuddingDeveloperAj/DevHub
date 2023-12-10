import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error(`User does not exist`);
    }

    return [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "Js",
      },
      {
        _id: "3",
        name: "DSA",
      },
    ];
  } catch (error) {
    console.log(error);
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDatabase();

    const { searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const tags = await Tag.find(query);

    return { tags };
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    await connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return {
      tagTitle: tag.name,
      questions,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getPopularTags = async () => {
  try {
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: { name: 1, totalQuestions: { $size: "$questions" } },
      },
      {
        $sort: { totalQuestions: -1 },
      },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
  }
};
