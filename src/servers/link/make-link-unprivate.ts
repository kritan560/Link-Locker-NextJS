"use server";

import { PrivateUrl } from "@prisma/client";
import prisma from "../../../prisma/db";

type MakeLinkUnPrivateReturnType = {
  success: boolean;
  message: string;
  data: PrivateUrl | null;
};

/**
 * This server action will make the URL private by moving it to the vault. for authenticated user only
 *
 * @param url - The PrivateURL document
 * @returns
 */
export async function MakeLinkUnPrivate(
  url: PrivateUrl
): Promise<MakeLinkUnPrivateReturnType> {
  try {
    const existingUrl = await prisma.url.findFirst({
      where: { AND: [{ url: url.url, userId: url.userId }] },
    });

    if (existingUrl) {
      await prisma.privateUrl.delete({
        where: { id: url.id },
        include: { user: true },
      });

      return {
        data: null,
        success: true,
        message: "URL already exist",
      };
    }

    const [newUnprivateURL, deletedPrivateURL] = await prisma.$transaction([
      prisma.url.create({ data: url }),
      prisma.privateUrl.delete({
        where: { id: url.id },
      }),
    ]);

    return {
      data: newUnprivateURL,
      message: "Link removed from vault",
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
