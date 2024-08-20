"use server";

import prisma from "../../../prisma/db";

type GetTotalUrlReturnType = {
  success: boolean;
  data: number | null;
  message: string;
};

/**
 * Gets all The links that is related to the active user ID.
 *
 * @param userId - The User Id
 * @returns
 */
export async function GetTotalUrl({
  userId,
}: {
  userId: string | undefined;
}): Promise<GetTotalUrlReturnType> {
  try {
    const totalUrl = await prisma.url.count({
      where: { userId },
    });

    return {
      success: true,
      data: totalUrl,
      message: "Got total number of Links",
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

type GetTotalUrlOfSearchedKeywordReturnType = {
  success: boolean;
  data: number | null;
  message: string;
};

/**
 * Gets all The links that is related to the active user ID.
 *
 * @param userId - The User Id
 * @returns
 */
export async function GetTotalUrlOfSearchedKeyword({
  userId,
  searchKeyword,
}: {
  userId: string | undefined;
  searchKeyword: string;
}): Promise<GetTotalUrlOfSearchedKeywordReturnType> {
  try {
    const totalUrl = await prisma.url.count({
      where: { userId, url: { contains: searchKeyword } },
    });

    return {
      success: true,
      data: totalUrl,
      message: "Got total number of Links",
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

export type GetLinksByPageProps = {
  userId: string | undefined;
  page: number;
};

/**
 * if page 0 exist and it means take 10 document without skipping anything
 *
 * @param props
 * @returns the exactly 10 Url datas if exist else return the remaining.
 */
export async function GetLinksByPage(props: GetLinksByPageProps) {
  const { userId, page } = props;

  const skip = page * 10;
  const take = 10;

  try {
    const Urls = await prisma.url.findMany({
      where: { userId },
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

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

export type GetLinksBySearchKeywordProps = {
  userId: string | undefined;
  searchKeyword: string;
  page: number;
};

/**
 *
 * @param props
 * @returns the exactly 10 Url datas if exist else return the remaining.
 */
export async function GetLinksBySearchKeyword(
  props: GetLinksBySearchKeywordProps
) {
  const { userId, searchKeyword, page } = props;

  const skip = page * 10;
  const take = 10;

  try {
    const Urls = await prisma.url.findMany({
      where: { userId, url: { contains: searchKeyword } },
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

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
