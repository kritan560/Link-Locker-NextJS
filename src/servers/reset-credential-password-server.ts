"use server";

import { ResetCredentialPasswordSchemaType } from "@/schemas/reset-credential-password-schema";
import { hash } from "bcryptjs";
import prisma from "../../prisma/db";

type ResetCredentialPasswordServerReturnType = {
  success: boolean;
  message: string;
  data: null;
};

/**
 * It will reset your credential account password to new password you have entered.
 * @param values - ResetCredentialPasswordSchemaType
 * @param token - The token from email
 * @returns 
 */
export async function ResetCredentialPasswordServer(
  values: ResetCredentialPasswordSchemaType,
  token: string | null
): Promise<ResetCredentialPasswordServerReturnType> {
  try {
    // check if old and new pass do not match
    if (values.ConfirmPassword !== values.Password) {
      return {
        success: false,
        data: null,
        message: "Confirm password and password does not match",
      };
    }

    if (!token) {
      return {
        success: false,
        data: null,
        message: "Token Not found",
      };
    }

    const resetToken = await prisma.userPasswordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return {
        success: false,
        data: null,
        message: "Reset token not found",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      return {
        success: false,
        data: null,
        message: "User not accociated with this token",
      };
    }

    const hashedPassword = await hash(values.ConfirmPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    // Deleting the old user password reset token
    await prisma.userPasswordResetToken.delete({
      where: { userId: updatedUser.id },
    });

    if (updatedUser) {
      return {
        success: true,
        data: null,
        message: "User Password updated",
      };
    }

    return {
      success: false,
      data: null,
      message: "Failed to upadate User",
    };
  } catch (error) {
    // console.error(error);

    return {
      data: null,
      message: "Something went wrong",
      success: false,
    };
  }
}
