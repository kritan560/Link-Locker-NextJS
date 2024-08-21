"use server";

import { Url } from "@prisma/client";
import prisma from "../../../prisma/db";

type BlurLinkReturnType = {
  success: boolean;
  message: string;
  data: Url | null;
};

/**
 * This server action will update the URL document blur field. of authenticated user
 *
 * @param url - The URL Schema
 * @returns
 */
export async function BlurLink(url: Url): Promise<BlurLinkReturnType> {
  try {
    const blurURL = await prisma.url.update({
      where: { id: url.id },
      data: { blur: !url.blur },
    });

    if (blurURL.blur === false) {
      return { data: null, message: "Link Un-Blur", success: true };
    } else {
      return { data: null, message: "Link Blur", success: true };
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
