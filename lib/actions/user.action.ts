"use server";

import {
  CreateUserParams,
  GetAllUsersParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { requestHandler } from "../requestHandler";

export async function getUserDetails(params: any) {
  try {
    const { userId } = params;
    const response = await requestHandler({
      url: `/users/${userId}`,
      method: "get",
    });

    return response.data.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    const user = await requestHandler({
      url: "/users",
      method: "post",
      payload: userData,
    });

    return user.data.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    const { clerkId, updateData, path } = params;

    await requestHandler({
      method: "PUT",
      payload: updateData,
      url: `users/${clerkId}`,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

// export async function deleteUser(params: DeleteUserParams) {
//   try {
//     await connectToDatabase();

//     const { clerkId } = params;
//     const user = await User.findOneAndDelete({ clerkId });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Delete user from database
//     // Delete questions, answers, comments etc

//     // const userQuestionIds = await Question.find({ author: user._id }).distinct(
//     //   "_id"
//     // );

//     await Question.deleteMany({ author: user._id });
//     const deletedUser = await Question.findByIdAndDelete(user._id);

//     return deletedUser;
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    // const {page=1, pageSize=20, filter, searchQuery} = params;
    const results = await requestHandler({
      url: "/users",
      method: "GET",
    });

    return { users: results.data.data.users };
  } catch (error) {
    console.log(error);
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    const { userId, questionId, path } = params;
    console.log(params, 456);

    await requestHandler({
      url: `/users/${userId}/save/${questionId}`,
      method: "put",
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
