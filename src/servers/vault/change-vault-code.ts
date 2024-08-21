"use server";

import { auth } from "@/auth";
import { PrivateUrlCode } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import prisma from "../../../prisma/db";
import { GetVaultCode } from "./get-vault-code";

type ChangeVaultCodeReturnType = {
  success: boolean;
  message: string;
  data: PrivateUrlCode | null;
};

/**
 * This function wil change the vault code. takes old and new vault code to compare and update
 *
 * @param oldVaultCode - The old vault code
 * @param newVaultCode - The new vault code
 * @returns
 */
export async function ChangeVaultCode(
  oldVaultCode: string,
  newVaultCode: string
): Promise<ChangeVaultCodeReturnType> {
  try {
    // get the old code hash compare and change code
    const session = await auth();
    const userId = session?.user.id;

    const { data, success } = await GetVaultCode(userId);

    if (success) {
      const hashedCode = data?.code;

      if (!hashedCode) {
        return {
          data: null,
          message: "Code not found in DB",
          success: false,
        };
      }

      const isCodeCorrect = await compare(oldVaultCode, hashedCode);

      if (isCodeCorrect) {
        const newHashedCode = await hash(newVaultCode, 10);

        const changedVaultCode = await prisma.privateUrlCode.update({
          data: { code: newHashedCode },
          where: { userId },
        });

        return {
          data: changedVaultCode,
          message: "Vault Code Changed",
          success: true,
        };
      } else {
        return {
          data: null,
          message: "Old vault code not match",
          success: false,
        };
      }
    } else {
      return {
        data: null,
        message: "Failed getting vault code",
        success: false,
      };
    }
  } catch (error) {
    // 
    return {
      data: null,
      message: "Something went wrong!!!",
      success: false,
    };
  }
}
