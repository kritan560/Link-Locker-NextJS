"use server";

import { TransportMail } from "@/email/transporter";
import { GenerateAndHashCode } from "@/helpers/generate-and-hash-code";
import { IsUserVerificationTokenExpired } from "@/helpers/is-user-verification-expired";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import prisma from "../../prisma/db";

type VerifyUserOTPServerReturnType = {
  success: boolean;
  message: string;
  data: User | null;
};

/**
 * This server action will verify the user OTP if user verification token is not expired
 *
 * if User is verified then it will send you the vault code to registered email
 *
 * @param hash - The hashed OTP code
 * @param otp - The OTP
 * @returns
 */
export async function VerifyUserOTPServer(
  hash: string,
  otp: string
): Promise<VerifyUserOTPServerReturnType> {
  try {
    const isOTPVerified = await compare(otp, hash);

    if (!isOTPVerified) {
      return {
        data: null,
        message: "please enter the correct otp",
        success: false,
      };
    }

    const userWithHash = await prisma.userVerificationCode.findUnique({
      where: { code: hash },
      select: { userId: true, createdAt: true },
    });

    // user found with hash
    if (userWithHash) {
      // // is verification token expired?
      const isUserVerificationTokenExpired = IsUserVerificationTokenExpired(
        userWithHash.createdAt
      );

      if (isUserVerificationTokenExpired) {
        return {
          data: null,
          message: "verification token expired please sign-in again",
          success: false,
        };
      }

      const userId = userWithHash.userId;

      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: new Date() },
      });

      // delete the verification code after the user is verified
      await prisma.userVerificationCode.delete({ where: { code: hash } });

      // if user is verified then send the vault code to the verified user
      if (updateUser.email) {
        // generating and hashing the new verification code
        const { hashedUnique6DigitCode, unique6digitCode } =
          await GenerateAndHashCode();

        // create the privateURL vault code for user to acess the vault and send mail
        TransportMail(
          updateUser.email,
          `<p>This is your vault code : ${unique6digitCode} change this code as soon as you recieve this mail<p/>`,
          "Link Locker Vault code"
        );

        await prisma.privateUrlCode.create({
          data: { code: hashedUnique6DigitCode, userId: updateUser.id },
        });

        return {
          message: "vault code send to your email",
          data: null,
          success: true,
        };
      }

      return {
        message: "user has been successfully verified",
        success: true,
        data: updateUser,
      };
    } else {
      return {
        message: "user not found with following code",
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.error(error, "verify user otp server");

    return {
      message: "Something went wrong!!!",
      success: false,
      data: null,
    };
  }
}
