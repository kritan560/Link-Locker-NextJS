"use server";

import { GetAuthUserSession } from "@/helpers/get-auth-user-session";
import prisma from "../../prisma/db";
import { LinkTableReturnUrlType } from "../../types/link-table-return-type";

type LinkTableServerProps = {
  take?: number;
  skip?: number;
};

type LinkTableServerReturnType = {
  success: boolean;
  data: null | LinkTableReturnUrlType;
  message: string;
};

/**
 * 
 * 
 * @param props - LinkTableServerProps
 */
export async function LinkTableServer(
  props: LinkTableServerProps
): Promise<LinkTableServerReturnType> {
  const { skip = 0, take = 10 } = props;

  try {
    const { id, isUserLoggedIn } = await GetAuthUserSession();

    if (!isUserLoggedIn) {
      return {
        data: null,
        message: "User Not Logged In",
        success: false,
      };
    }

    const authUserUrls = await prisma.url.findMany({
      skip,
      take,
      select: {
        blur: true,
        createdAt: true,
        updatedAt: true,
        url: true,
      },
      where: { id },
    });

    return {
      data: authUserUrls,
      message: "Data found",
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      data: null,
      message: "Something went wrong",
      success: false,
    };
  }
}
