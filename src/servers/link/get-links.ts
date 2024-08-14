"use server";

import { Url } from "@prisma/client";
import prisma from "../../../prisma/db";

type GetLinksReturnType = {
  success: boolean;
  data: Url[] | null;
  message: string;
};

/**
 * Gets all The links that is related to the active user ID.
 *
 * @param userId - The User Id
 * @returns
 */
export async function GetLinks(
  userId: string | undefined
): Promise<GetLinksReturnType> {
  try {
    const urls = await prisma.url.findMany({ where: { userId } });

    return {
      success: true,
      data: urls,
      message: "Got all your links",
    };
  } catch (error) {
    console.error(error, "Get Link error");

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}
