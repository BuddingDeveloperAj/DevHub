"use server";

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
import Interaction from "@/database/interaction.model";

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

    const top3InteractedTags = await Interaction.aggregate([
      { $match: { user: user._id } }, // Match interactions by user ID
      { $unwind: "$tags" }, // Unwind the tags array
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }, // Count occurrences of each tag
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 3 }, // Limit to the top 3 tags
      {
        $lookup: {
          from: "tags", // Replace 'tags' with your actual collection name
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      {
        $project: {
          _id: "$_id",
          name: "$tagInfo.name", // Include the name field
        },
      },
    ]);

    console.log(top3InteractedTags);

    return top3InteractedTags;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    const toSkip = pageSize * (page - 1);

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .collation({ locale: "en", strength: 2 })
      .skip(toSkip)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);
    const totalPages = Math.ceil(totalTags / pageSize);

    const isNext = totalTags > toSkip + tags.length;

    return { tags, totalPages, isNext };
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    await connectToDatabase();

    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const toSkip = pageSize * (page - 1);

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: toSkip,
        limit: pageSize,
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

    const tagDetails = await Tag.findOne(tagFilter).populate({
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
    const totalQuestions = tagDetails.questions.length;

    const totalPages = Math.ceil(totalQuestions / pageSize);
    const questions = tag.questions;

    const isNext = totalQuestions > toSkip + questions.length;
    return {
      tagTitle: tag.name,
      questions,
      isNext,
      totalPages,
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
