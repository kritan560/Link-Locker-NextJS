"use server";

import { auth } from "@/auth";
import prisma from "../../prisma/db";

type RemoveAccountServerReturnType = {
  success: boolean;
  data: null;
  message: string;
};

/**
 * This server action will remove the user account of a Link Locker
 *
 * @returns
 */
export async function RemoveAccountServer(): Promise<RemoveAccountServerReturnType> {
  try {
    const session = await auth();
    const activeUserEmail = session?.user.email;

    if (!activeUserEmail) {
      return {
        success: false,
        data: null,
        message: "Email not found",
      };
    }

    const userAccount = await prisma.user.findUnique({
      where: { email: activeUserEmail },
    });

    await prisma.user.delete({
      where: { id: userAccount?.id },
    });

    return {
      success: true,
      data: null,
      message: "Account Deleted Successfully",
    };
  } catch (error) {
    // 

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}
