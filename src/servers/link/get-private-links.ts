"use server";

import { PrivateUrl } from "@prisma/client";
import prisma from "../../../prisma/db";

type GetPrivateLinksReturnType = {
  success: boolean;
  data: PrivateUrl[] | null;
  message: string;
};

/**
 * Gets all The Privatelinks that is related to the active user ID.
 * 
 * @param userId - The User Id
 * @returns
 */
export async function GetPrivateLinks(
  userId: string | undefined
): Promise<GetPrivateLinksReturnType> {
  try {
    const urls = await prisma.privateUrl.findMany({ where: { userId } });

    return {
      success: true,
      data: urls,
      message: "Got all your links",
    };
  } catch (error) {
    console.error(error, "Get private Link error");
    
    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}
