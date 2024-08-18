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
    const urls = await prisma.url.findMany({
      where: { userId },
    });

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

type GetLinksPaginationProps = {
  userId: string | undefined;
  take: number;
  skip: number;
};

export async function GetLinksPagination(props: GetLinksPaginationProps) {
  const { userId, skip, take } = props;

  try {
    const Urls = await prisma.url.findMany({ where: { userId }, take, skip });

    return {
      success: true,
      data: Urls,
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

type GetLinksByPageProps = {
  userId: string | undefined;
  page: number;
};

/**
 * page 0 exist and it means take 10 document without skipping anything
 * @param props
 * @returns
 */
export async function GetLinksByPage(props: GetLinksByPageProps) {
  const { userId, page } = props;

  const skip = page * 10;
  const take = 10;

  try {
    const Urls = await prisma.url.findMany({ where: { userId }, take, skip });

    return {
      success: true,
      data: Urls,
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
