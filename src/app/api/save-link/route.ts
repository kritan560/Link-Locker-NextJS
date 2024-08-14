import { auth } from "@/auth";
import { LinkLockerPrivateLinkRoute } from "@/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { SaveLinkReturnType } from "./route.reutrntype";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SaveLinkReturnType>> {
  try {
    const waitFor = (ms: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };

    await waitFor(2000);

    const session = await auth();
    const userId = session?.user.id;

    if (!userId || !session) {
      return NextResponse.json({
        isUserLoggedIn: false,
        message: "user is not logged In",
        success: false,
      });
    }

    const body = await request.json();

    const {
      clipboardData,
      pathname,
    }: { clipboardData: string; pathname: string } = body;

    if (pathname.startsWith(LinkLockerPrivateLinkRoute)) {
      // check if private url already exist
      const existingPrivateURL = await prisma.privateUrl.findFirst({
        where: { AND: [{ url: clipboardData }, { userId }] },
      });

      if (existingPrivateURL) {
        return NextResponse.json({
          message: "Private URL already saved in Database",
          success: false,
        });
      }

      // Create a URL document for clipboardData
      await prisma.privateUrl.create({
        data: { url: clipboardData, userId },
      });

      return NextResponse.json({
        success: true,
        message: "Private URL Saved Into Database",
      });
    }

    // check if URL already exist
    const existingURL = await prisma.url.findFirst({
      where: { AND: [{ url: clipboardData }, { userId }] },
    });

    if (existingURL) {
      return NextResponse.json({
        message: "URL already saved in Database",
        success: false,
      });
    }

    // Create a URL document for clipboardData
    await prisma.url.create({
      data: { url: clipboardData, userId },
    });

    return NextResponse.json({
      success: true,
      message: "URL Saved Into Database",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong!!!",
    });
  }
}
