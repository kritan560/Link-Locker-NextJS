"use server";

import { User } from "@prisma/client";
import prisma from "../../prisma/db";

type GetProfileDetailReturnType = {
  success: boolean;
  data: User | null;
  message: string;
};

/**
 * This server action will get the profile detail of currently authenticated user
 *
 * @param email - The currently authenticated user email
 * @returns
 */
export async function GetProfileDetail(
  email: string
): Promise<GetProfileDetailReturnType> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        data: null,
        message: "User not found",
        success: false,
      };
    }

    return {
      data: user,
      message: "User Details",
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
