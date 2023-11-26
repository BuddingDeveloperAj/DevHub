import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
  }
};
