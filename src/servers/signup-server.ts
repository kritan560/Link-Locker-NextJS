"use server";

import { TransportMail } from "@/email/transporter";
import { GenerateAndHashCode } from "@/helpers/generate-and-hash-code";
import { GetBaseURL } from "@/helpers/get-base-url";
import { IsUserVerificationTokenExpired } from "@/helpers/is-user-verification-expired";
import { SignUpSchemaType } from "@/schemas/signup-schema";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import prisma from "../../prisma/db";

type SignUpServerReturnType = {
  success: boolean;
  message: string;
  data: User | null;
};

/**
 * This server action will signup the user only if user is not signup
 *
 * if succssfully signup send the verification token to their email
 *
 * @param values - The signUpSchemaType
 * @returns
 */
export async function SignUpServer(
  values: SignUpSchemaType
): Promise<SignUpServerReturnType> {
  try {
    // only the new user or anonymous user are allowd to signUp.

    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
      include: { userVerificationCode: true },
    });

    if (existingUser) {
      const existingUserVerificationTokenCreationDate =
        existingUser?.userVerificationCode?.createdAt;

      if (existingUserVerificationTokenCreationDate) {
        // confirming if the existing user verification token exipred
        const IsExistingUserVerificationTokenExpired =
          IsUserVerificationTokenExpired(
            existingUserVerificationTokenCreationDate
          );

        if (IsExistingUserVerificationTokenExpired && existingUser.email) {
          const { hashedUnique6DigitCode, unique6digitCode } =
            await GenerateAndHashCode();

          // creating the new verification code and connecting it to existing user
          await prisma.userVerificationCode.create({
            data: { code: hashedUnique6DigitCode, userId: existingUser.id },
          });

          // sending the mail with new verification code
          TransportMail(
            existingUser.email,
            `<p>your verification url is : ${GetBaseURL()}/verify-user?hash=${hashedUnique6DigitCode}</p>
          <p>your verification code is : ${unique6digitCode}</p>`,
            "RE: New Verification Token"
          );

          // returning the response : new verification send
          return {
            success: true,
            message: "New Verification code is sent. Check Your Email",
            data: null,
          };
        }

        // is verification token is not expired means the user signed up but not verified their account
        if (!IsExistingUserVerificationTokenExpired) {
          return {
            success: false,
            message: "Account not verify please verify to continue",
            data: null,
          };
        }
      }

      // The user want to signup but account already exists in server
      return {
        success: false,
        message: "User Already Exist in Server redirecting you to signin page",
        data: null,
      };
    }

    // is existingUser not found : meaning the user is not registerd in server you can create a user profile for them
    // hash the password
    const hashedPassword = await hash(values.password, 10);

    const { hashedUnique6DigitCode, unique6digitCode } =
      await GenerateAndHashCode();

    const newUser = await prisma.user.create({
      data: {
        email: values.email,
        hashedPassword,
        emailVerified: null,
        userVerificationCode: { create: { code: hashedUnique6DigitCode } },
      },
    });

    // TODO : new user is created but not verified yet send the verification mail here with unique6digitCode.
    TransportMail(
      values.email,
      `<p>your verification url is : ${GetBaseURL()}/verify-user?hash=${hashedUnique6DigitCode}</p>
      <p>your verification code is : ${unique6digitCode}</p>`,
      "New User Registration at Link Locker"
    );

    return {
      success: true,
      data: newUser,
      message: "Please check your email to verify your account",
    };
  } catch (error) {
    // 

    return { success: false, message: "Something went wrong!!!", data: null };
  }
}
