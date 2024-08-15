"use server";

import { PrivateUrl } from "@prisma/client";
import prisma from "../../../prisma/db";

type BlurPrivateLinkReturnType = {
  success: boolean;
  message: string;
  data: PrivateUrl | null;
};

/**
 * This server action will update the PrivateURL document blur field. of authenticated user
 *
 * @param url - The PrivateURL Schema
 * @returns
 */
export async function BlurPrivateLink(
  url: PrivateUrl
): Promise<BlurPrivateLinkReturnType> {
  try {
    const blurURL = await prisma.privateUrl.update({
      where: { id: url.id },
      data: { blur: !url.blur },
    });

    if (blurURL) {
      if (blurURL.blur) {
        return {
          data: null,
          message: "Private Link Blur",
          success: true,
        };
      }

      return {
        data: null,
        message: "Private Link Un-Blur",
        success: true,
      };
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
