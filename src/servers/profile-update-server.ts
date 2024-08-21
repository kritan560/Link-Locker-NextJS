"use server";

import { auth } from "@/auth";
import { ProfileUpdateSchemaType } from "@/schemas/profile-update-schema";
import { User } from "@prisma/client";
import prisma from "../../prisma/db";

type ProfileUpdateServerReturnType = {
  success: boolean;
  message: string;
  data: User | null;
};

/**
 * This server action will update the profile of currently authenticated user.
 *
 * @param values - ProfileUpdateSchemaType
 * @returns
 */
export async function ProfileUpdateServer(
  values: ProfileUpdateSchemaType
): Promise<ProfileUpdateServerReturnType> {
  try {
    const session = await auth();

    const loggedInUserEmail = session?.user.email;

    if (!loggedInUserEmail) {
      return {
        data: null,
        message: "User not found in server",
        success: false,
      };
    }

    const updatedUser = await prisma.user.update({
      where: { email: loggedInUserEmail },
      data: { name: values.name },
    });

    return {
      data: updatedUser,
      message: "User Updated",
      success: true,
    };
  } catch (error) {
    // 

    return {
      data: null,
      message: "Something went wrong!!!",
      success: false,
    };
  }
}
