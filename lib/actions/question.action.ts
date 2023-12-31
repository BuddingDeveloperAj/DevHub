"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "./mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
import { generateAITagDescription } from "../utils";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    const { title, content, tags, author, path } = params;
    await connectToDatabase();

    // create a new question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Searching for tag in DB if found update else create
    for (const tag of tags) {
      let existingTag = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag}$`, "i") },
      });

      if (!existingTag) {
        const description = await generateAITagDescription(tag);
        existingTag = await Tag.create({ name: tag, description });
      }

      existingTag.questions.push(question._id);
      await existingTag.save();

      tagDocuments.push(existingTag._id);
    }

    // Updating the tags into the question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await Interaction.create({
      user: author,
      action: "ask_question",
      quesion: question._id,
      tags: tagDocuments,
    });

    // Incrementing reputation by 5 for creating question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    const toSkip = pageSize * (page - 1);

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .skip(toSkip)
      .limit(pageSize)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / pageSize);

    const isNext = totalQuestions > toSkip + questions.length;

    return { questions, isNext, totalPages };
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const questionId = params.questionId;
    const question = await Question.findById({ _id: questionId })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id name clerkId picture",
      });

    return question;
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, hasDownvoted, hasUpvoted, path } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment user reputation if upvoted
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, hasDownvoted, hasUpvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, path } = params;

    await Question.findByIdAndDelete(questionId);
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    const { questionId, title, content, path } = params;
    await connectToDatabase();

    const question =
      await Question.findByIdAndUpdate(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;
    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase();
    const hotQuesitons = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return hotQuesitons;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const toSkip = (page - 1) * pageSize;

    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        {
          tags: {
            $in: distinctUserTagIds,
          },
        },
        {
          author: {
            $ne: user._id,
          },
        },
      ],
    };

    if (searchQuery) {
      query.$or = [
        {
          title: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          content: {
            $regex: searchQuery,
            $options: "i",
          },
        },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);
    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(toSkip)
      .limit(pageSize);

    const isNext = totalQuestions > toSkip + recommendedQuestions.length;
    const totalPages = Math.ceil(totalQuestions / pageSize);

    return {
      questions: recommendedQuestions,
      isNext,
      totalPages,
    };
  } catch (error) {
    console.log(error);
  }
}
