"use server";

import { auth } from "@/auth";
import { compare, hash } from "bcryptjs";
import prisma from "../../prisma/db";

type ChangeCredentialPasswordReturnType = {
  success: boolean;
  message: string;
  data: null;
};

export async function ChangeCredentialPasswordServer(
  oldPassword: string,
  newPassword: string
): Promise<ChangeCredentialPasswordReturnType> {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const userAccountType = session?.user.type;

    // TODO : should check for the logged in account type and if it is credentials then procced to change the password

    if (userAccountType === "credentials") {
      const currentLoggedInUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      const currentLoggedInUserHashedPassword =
        currentLoggedInUser?.hashedPassword;

      // there is not hashed password. User might logged in from OAuth
      if (!currentLoggedInUserHashedPassword) {
        return {
          success: false,
          data: null,
          message: "Account type is not credentials",
        };
      }

      const isOldPasswordCorrect = await compare(
        oldPassword,
        currentLoggedInUserHashedPassword
      );

      if (!isOldPasswordCorrect) {
        return {
          success: false,
          data: null,
          message: "Old password not match",
        };
      }

      const newHashedPassword = await hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { hashedPassword: newHashedPassword },
      });

      return {
        success: true,
        data: null,
        message: "Password changed successfully",
      };
    }

    return {
      success: true,
      data: null,
      message: "OAuth Account does not have password",
    };
  } catch (error) {
    // console.error(error);

    return {
      success: false,
      data: null,
      message: "Something went wrong!!!",
    };
  }
}
