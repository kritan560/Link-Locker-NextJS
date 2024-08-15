"use server";

import { Url } from "@prisma/client";
import prisma from "../../../prisma/db";

type DeleteLinkReturnType = {
  success: boolean;
  message: string;
  data: Url | null;
};

/**
 * This server action will delete the URL document of authenticated user
 *
 * @param id - the URL document, field id
 * @returns
 */
export async function DeleteLink(id: string): Promise<DeleteLinkReturnType> {
  try {
    const deletedURL = await prisma.url.delete({ where: { id } });

    if (deletedURL) {
      return { data: null, message: "Link Deleted", success: true };
    }

    return {
      data: null,
      message: "URL not found in database",
      success: false,
    };
  } catch (error) {
    // console.error(error);

    return { data: null, message: "Something went wrong", success: false };
  }
}
