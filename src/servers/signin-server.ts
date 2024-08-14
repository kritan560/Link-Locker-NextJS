"use server";

import { signIn } from "@/auth";
import { LinkLockerHomepage } from "@/constants/routes";
import { TransportMail } from "@/email/transporter";
import { GenerateAndHashCode } from "@/helpers/generate-and-hash-code";
import { GetBaseURL } from "@/helpers/get-base-url";
import { SignInSchemaType } from "@/schemas/signin-schema";
import { compare, hash } from "bcryptjs";
import prisma from "../../prisma/db";

type SignInServerReturnType = {
  success: boolean;
  message: string;
};

/**
 * This server action will signIn the verified user.
 *
 * if user is registered but unverifed tries to sign in will send a token to their email
 *
 * @param values - The SignInSchemaType
 * @returns
 */
export async function SignInCredentialServer(
  values: SignInSchemaType
): Promise<SignInServerReturnType> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: values.email },
      include: { userVerificationCode: true },
    });

    if (!user) {
      return { message: "Register to continue", success: false };
    }

    // user must be logged in with oauth and now want to login with credentials
    if (user.email && !user.hashedPassword) {
      // create an credential account for user.

      const hashedPassword = await hash(values.password, 10);

      await prisma.user.update({
        data: { hashedPassword },
        where: { id: user.id },
      });

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        redirectTo: LinkLockerHomepage,
      });

      if (signInResponse) {
        return {
          success: true,
          message: "Login successfully",
        };
      }

      return {
        message: "Sign in Success",
        success: true,
      };
    }

    // user have an account but is not verified. then user tries same unverified accouint to login.
    if (!user.emailVerified && user.email) {
      // Deleting the old verification code
      await prisma.userVerificationCode.delete({
        where: { id: user.userVerificationCode?.id },
      });

      // generating and hashing the new verification code
      const { hashedUnique6DigitCode, unique6digitCode } =
        await GenerateAndHashCode();

      // creating the new verification code and connecting it to existing user
      await prisma.userVerificationCode.create({
        data: { code: hashedUnique6DigitCode, userId: user.id },
      });

      // sending the mail with new verification code
      TransportMail(
        user.email,
        `<p>your verification url is : ${GetBaseURL()}/verify-user?hash=${hashedUnique6DigitCode}</p>
        
      <p>your verification code is : ${unique6digitCode}</p>`,
        "RE: New Verification Token"
      );

      return { message: "user not verified please verify to continue", success: false };
    }

    if (user.hashedPassword) {
      const isPasswordCorrect = await compare(
        values.password,
        user.hashedPassword
      );

      if (!isPasswordCorrect) {
        return {
          message: "Invalid credentials",
          success: false,
        };
      }
    }

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      redirectTo: LinkLockerHomepage,
    });

    if (signInResponse) {
      return {
        success: true,
        message: "Login successfully",
      };
    }

    return {
      success: false,
      message: "Failed to signin",
    };
  } catch (error) {
    console.error(error, "signin-server");

    return {
      message: "Something went wrong!!!",
      success: false,
    };
  }
}
