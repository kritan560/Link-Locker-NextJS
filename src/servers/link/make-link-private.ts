"use server";

import { Url } from "@prisma/client";
import prisma from "../../../prisma/db";

type MakeLinkPrivateReturnType = {
  success: boolean;
  message: string;
  data: Url | null;
};

/**
 * This server action will make the links private of authenticated user
 *
 * @param url - The URL document
 * @returns
 */
export async function MakeLinkPrivate(
  url: Url
): Promise<MakeLinkPrivateReturnType> {
  try {
    const existingUrl = await prisma.privateUrl.findFirst({
      where: { AND: [{ url: url.url, userId: url.userId }] },
    });

    if (existingUrl) {
      await prisma.url.delete({
        where: { id: url.id },
        include: { user: true },
      });

      return {
        data: null,
        message: "URL already exists in PrivateURL",
        success: true,
      };
    }

    const [newPrivateLink, deletedURL] = await prisma.$transaction([
      prisma.privateUrl.create({ data: url }),
      prisma.url.delete({
        where: { id: url.id },
        include: { user: true },
      }),
    ]);

    // check if url already exist in PrivateURL document if exist then delete the url from unprivate URL and do not create privateURL
    // else delete form unprivate URL and move to ( create ) privateURL

    return {
      data: newPrivateLink,
      message: "Link is now private",
      success: true,
    };
  } catch (error) {
    console.error(error, "make link private");

    return {
      data: null,
      message: "Something went wrong!!!",
      success: false,
    };
  }
}
