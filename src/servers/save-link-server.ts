"use server";

import { auth } from "@/auth";
import { LinkLockerPrivateLinkRoute } from "@/constants/routes";
import prisma from "../../prisma/db";

type SaveLinkServerProps = {
  clipboardData: string;
  pathname: string;
};

export async function SaveLinkServer(props: SaveLinkServerProps) {
  const { clipboardData, pathname } = props;

  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId || !session) {
      return {
        message: "user is not logged In",
        success: false,
      };
    }

    if (pathname.startsWith(LinkLockerPrivateLinkRoute)) {
      // check if private url already exist
      const existingPrivateURL = await prisma.privateUrl.findFirst({
        where: { AND: [{ url: clipboardData }, { userId }] },
      });

      if (existingPrivateURL) {
        return {
          message: "Private URL already saved in Database",
          success: false,
        };
      }

      // Create a URL document for clipboardData
      await prisma.privateUrl.create({
        data: { url: clipboardData, userId },
      });

      return {
        success: true,
        message: "Private URL Saved Into Database",
      };
    }

    // check if URL already exist
    const existingURL = await prisma.url.findFirst({
      where: { AND: [{ url: clipboardData }, { userId }] },
    });

    if (existingURL) {
      return {
        message: "URL already saved in Database",
        success: false,
      };
    }

    // Create a URL document for clipboardData
    await prisma.url.create({
      data: { url: clipboardData, userId },
    });

    return {
      success: true,
      message: "URL Saved Into Database",
    };
  } catch (error) {
    // console.error(error);

    return {
      success: false,
      message: "Something went wrong!!!",
    };
  }
}
