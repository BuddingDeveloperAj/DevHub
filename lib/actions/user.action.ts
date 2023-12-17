"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export const getUserDetails = async (params: any) => {
  try {
    await connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({
      clerkId: userId,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDatabase();
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId } = params;
    const user: any = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // Delete questions, answers, comments etc

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    await Question.deleteMany({ author: user._id });
    const deletedUser = await Question.findByIdAndDelete(user?._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          username: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          email: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};
    const toSkip = pageSize * (page - 1);

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(toSkip)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / pageSize);

    const isNext = totalUsers > toSkip + users.length;

    return { users, totalPages, isNext };
  } catch (error) {
    console.log(error);
  }
};

export const getSavedQuesions = async (params: GetSavedQuestionsParams) => {
  try {
    await connectToDatabase();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const toSkip = pageSize * (page - 1);

    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { ...sortOptions },
        limit: pageSize,
        skip: toSkip,
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
    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;
    const userDetails = await User.findOne({ clerkId });
    const totalPages = Math.ceil(userDetails.saved.length / pageSize);

    const isNext = userDetails.saved.length > toSkip + savedQuestions.length;

    return { questions: savedQuestions, isNext, totalPages };
  } catch (error) {
    console.log(error);
  }
};

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    await connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({
      author: user._id,
    });

    const totalAnswers = await Answer.countDocuments({
      author: user._id,
    });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const toSkip = (page - 1) * pageSize;

    const userQuestions = await Question.find({
      author: userId,
    })
      .sort({ views: -1, upvotes: -1 })
      .skip(toSkip)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const totalPages = Math.ceil(totalQuestions / pageSize);

    const isNext = totalQuestions > toSkip + userQuestions.length;

    return {
      totalQuestions,
      questions: userQuestions,
      totalPages,
      isNext,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const toSkip = (page - 1) * pageSize;

    const userAnswers = await Answer.find({
      author: userId,
    })
      .sort({ upvotes: -1 })
      .skip(toSkip)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const totalPages = Math.ceil(totalAnswers / pageSize);

    const isNext = totalAnswers > toSkip + userAnswers.length;

    return {
      totalAnswers,
      answers: userAnswers,
      totalPages,
      isNext,
    };
  } catch (error) {
    console.log(error);
  }
};
