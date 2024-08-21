"use server";

import { auth } from "@/auth";
import { TransportMail } from "@/email/transporter";
import { GenerateAndHashCode } from "@/helpers/generate-and-hash-code";
import prisma from "../../../prisma/db";

// a new vault code will be sent to registered email.
// link locker password must be entered if logged in via credentials to reset vault code.

type ResetVaultCodeReturnType = {
  success: boolean;
  message: string;
  data: null;
};

/**
 *
 * @param credentialsPassword
 */
export async function ResetVaultCode(): Promise<ResetVaultCodeReturnType> {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const userEmail = session?.user.email;

    const userPrivateURLCode = await prisma.privateUrlCode.findUnique({
      where: { userId: userId },
      select: { updatedAt: true },
    });

    if (!userPrivateURLCode) {
      return {
        data: null,
        message: "Private Vault Code not found",
        success: false,
      };
    }
    // user have already requestd for reset vault code check email or cool down for an hour to request again
    if (
      60 * 60 * 1000 + userPrivateURLCode.updatedAt.getTime() >=
      new Date().getTime()
    ) {
      return {
        data: null,
        message: "Already request for code. check your email",
        success: false,
      };
    }

    if (!userEmail) {
      // user email check to make sure it exist before resetting vault code
      return {
        data: null,
        message: "User loggedin from Oauth",
        success: false,
      };
    }

    const { hashedUnique6DigitCode, unique6digitCode } =
      await GenerateAndHashCode();

    // send the mail with new vault code.
    TransportMail(
      userEmail,
      `<p>This is you new vault code : ${unique6digitCode} change as soon as possible after receiving this email</p>`,
      "RESET VAULT CODE"
    );

    await prisma.privateUrlCode.update({
      where: { userId: userId },
      data: { code: hashedUnique6DigitCode },
    });

    return {
      data: null,
      message: "Vault code has been reset. Check your email for new code",
      success: true,
    };
  } catch (error) {
    //(error, "reset vault code error");

    return {
      data: null,
      message: "Something went wrong!!!",
      success: false,
    };
  }
}
