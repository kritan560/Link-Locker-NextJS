"use server";

import { auth } from "@/auth";
import { TransportMail } from "@/email/transporter";
import { GenerateAndHashCode } from "@/helpers/generate-and-hash-code";
import prisma from "../../prisma/db";

type CreateVaultCodeOAuthUserReturnType = {
  message: string;
  success: boolean;
};

/**
 * This server action will generate the vault code for Verified Oauth user.
 *
 * Send the Vault code to registered email
 * @returns
 */
export async function CreateVaultCodeOAuthUser(): Promise<CreateVaultCodeOAuthUserReturnType> {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!session) {
      return {
        message: "User not logged In",
        success: false,
      };
    }

    const { hashedUnique6DigitCode, unique6digitCode } =
      await GenerateAndHashCode();

    const isExistingPrivateURLCode = await prisma.privateUrlCode.findUnique({
      where: { userId },
    });

    if (!isExistingPrivateURLCode?.code) {
      const privateURLCodeUser = await prisma.privateUrlCode.create({
        data: { userId, code: hashedUnique6DigitCode },
        include: { user: true },
      });

      const userEmail = privateURLCodeUser.user?.email;

      if (!userEmail) {
        return { message: "Email not found", success: false };
      }

      TransportMail(
        userEmail,
        `<p>This is your vault code : ${unique6digitCode} change this code as soon as you recieve this mail<p/>`,
        "LINK LOCKER : VAULT CODE"
      );

      return {
        message: "Vault Code sent to your Email. Please Check Your Email",
        success: true,
      };
    }

    return {
      message: "Vault Code Exists",
      success: false,
    };
  } catch (error) {
    // 

    return { message: "Something went wrong", success: false };
  }
}
