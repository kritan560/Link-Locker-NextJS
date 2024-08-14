"use server";

import { PrivateUrlCode } from "@prisma/client";
import { Session } from "next-auth";
import prisma from "../../../prisma/db";

type GetVaultCodeReturnType = {
  success: boolean;
  data: null | PrivateUrlCode;
  message: string;
};

/**
 * This server action will get the vault code of a currently authenticated user
 *
 * @param userId - The currently authenticated userId
 * @returns
 */
export async function GetVaultCode(
  userId: Session["user"]["id"]
): Promise<GetVaultCodeReturnType> {
  try {
    const vaultCode = await prisma.privateUrlCode.findUnique({
      where: { userId },
    });
    return {
      success: true,
      data: vaultCode,
      message: "Got Vault Code",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message: "Something went wrong!!!",
    };
  }
}
