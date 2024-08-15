"use server";

import { TransportMail } from "@/email/transporter";
import { GetBaseURL } from "@/helpers/get-base-url";
import prisma from "../../prisma/db";

type RequestCredentialPasswordResetTokenServerReturnType = {
  success: boolean;
  message: string;
  data: null;
};

/**
 * This server action will reset the user password
 *
 * @returns
 */
export async function RequestCredentialPasswordResetTokenServer(
  email: string
): Promise<RequestCredentialPasswordResetTokenServerReturnType> {
  try {
    // TODO : should check for the logged in account type and if it is credentials then procced to reset the password

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user || !user.email) {
      return {
        data: null,
        message: "User not found accociated with this email",
        success: false,
      };
    }

    // the NOT operator (!) is used coz account document (schema) is not created when logged in via credentials. so if 'credentials' do not included in userAccountType then it must be credentials account type.
    const isAccountTypeCredentials = user.hashedPassword ? true : false;

    // if account type is credentials then create a token for account pw reset
    // before creating see if there is an existing token for a user if then delete
    if (isAccountTypeCredentials) {
      const isExistingToken = await prisma.userPasswordResetToken.findUnique({
        where: { userId: user.id },
      });

      if (isExistingToken) {
        const tokenUpdatedDate = new Date(isExistingToken.updatedAt).getTime();
        const currentDate = new Date().getTime();
        const currentDate60MinuteLess = new Date().getTime() - 60 * 60 * 1000;
        const timeEsclaped = new Date(
          currentDate - tokenUpdatedDate
        ).getUTCMinutes();
        const tokenCoolDownRemaining = 60 - timeEsclaped;

        if (currentDate60MinuteLess < tokenUpdatedDate) {
          return {
            data: null,
            success: false,
            message: `Token cool down time. request next token after : ${tokenCoolDownRemaining} minute`,
          };
        }

        await prisma.userPasswordResetToken.delete({
          where: { userId: user.id },
        });
      }

      const token = crypto.randomUUID();
      await prisma.userPasswordResetToken.create({
        data: { token, userId: user.id },
      });

      TransportMail(
        user.email,
        `This is your password reset token link :${GetBaseURL()}/reset-credential-password?token=${token} click the link to reset your password`,
        "LINK LOCKER PASSWORD RESET"
      );

      return {
        data: null,
        message: "Password Reset Token created or this email",
        success: true,
      };
    }

    return {
      success: true,
      data: null,
      message: "Account type is not credentials",
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
