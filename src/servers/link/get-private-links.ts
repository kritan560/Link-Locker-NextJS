"use server";

import prisma from "../../../prisma/db";

type GetTotalPrivateUrlReturnType = {
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
export async function GetTotalPrivateUrl({
  userId,
}: {
  userId: string | undefined;
}): Promise<GetTotalPrivateUrlReturnType> {
  try {
    const totalPrivateUrl = await prisma.privateUrl.count({
      where: { userId },
    });

    return {
      success: true,
      data: totalPrivateUrl,
      message: "Got total number of Links",
    };
  } catch (error) {
    //(error, "Get Link error");

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}

export type GetPrivateLinksByPageProps = {
  userId: string | undefined;
  page: number;
};

/**
 * if page 0 exist and it means take 10 document without skipping anything
 *
 * @param props
 * @returns the exactly 10 Url datas if exist else return the remaining.
 */
export async function GetPrivateLinksByPage(props: GetPrivateLinksByPageProps) {
  const { userId, page } = props;

  const skip = page * 10;
  const take = 10;

  try {
    const Urls = await prisma.privateUrl.findMany({
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
    //(error, "Get Link error");

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}

type GetPrivateLinksBySearchKeywordProps = {
  userId: string | undefined;
  searchKeyword: string;
  page: number;
};

/**
 *
 * @param props
 * @returns the exactly 10 Url datas if exist else return the remaining.
 */
export async function GetPrivateLinksBySearchKeyword(
  props: GetPrivateLinksBySearchKeywordProps
) {
  const { userId, searchKeyword, page } = props;

  const skip = page * 10;
  const take = 10;

  try {
    const Urls = await prisma.privateUrl.findMany({
      where: { userId, url: { contains: searchKeyword, mode: "insensitive" } },
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
    //(error, "Get Link error");

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}

type GetTotalPrivateUrlOfSearchedKeywordReturnType = {
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
export async function GetTotalPrivateUrlOfSearchedKeyword({
  userId,
  searchKeyword,
}: {
  userId: string | undefined;
  searchKeyword: string;
}): Promise<GetTotalPrivateUrlOfSearchedKeywordReturnType> {
  try {
    const totalUrl = await prisma.privateUrl.count({
      where: { userId, url: { contains: searchKeyword } },
    });

    return {
      success: true,
      data: totalUrl,
      message: "Got total number of Links",
    };
  } catch (error) {
    //(error, "Get Link error");

    return {
      success: false,
      data: null,
      message: "Something went wrong",
    };
  }
}
