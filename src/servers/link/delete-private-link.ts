"use server";

import { PrivateUrl } from "@prisma/client";
import prisma from "../../../prisma/db";

type DeletePrivateLinkReturnType = {
  success: boolean;
  message: string;
  data: PrivateUrl | null;
};

/**
 * This server action will delete the PrivateURL document of authenticated user
 *
 * @param id - the PrivateURL document, field id
 * @returns
 */
export async function DeletePrivateLink(
  id: string
): Promise<DeletePrivateLinkReturnType> {
  try {
    const deletedURL = await prisma.privateUrl.delete({ where: { id } });

    if (deletedURL) {
      return {
        data: null,
        message: "Private Link Deleted",
        success: true,
      };
    }

    return {
      data: null,
      message: "URL not found in database",
      success: false,
    };
  } catch (error) {
    // 
    
    return { data: null, message: "Something went wrong", success: false };
  }
}
