import { auth } from "@/auth";
import MainPageTourGuide from "@/components/main-page-tour-guide";
import { ValidatePageNumber } from "@/helpers/validate-page-number";
import {
  GetLinksByPage,
  GetLinksBySearchKeyword,
  GetTotalUrl,
  GetTotalUrlOfSearchedKeyword,
} from "@/servers/link/get-links";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: "Link Locker",
};

type HomePageProps = {
  searchParams: { page: string; search: string };
};

export default async function HomePage(props: HomePageProps) {
  const {
    searchParams: { page, search },
  } = props;

  const session = await auth();

  if (!session) {
    return;
  }

  if (search) {
    const { data: TotalUrlData } = await GetTotalUrlOfSearchedKeyword({
      userId: session.user.id,
      searchKeyword: search,
    });

    // validated current page number
    const { currentPageNumber: pageNumber, totalPageNumber } =
      ValidatePageNumber({
        totalData: TotalUrlData,
        page,
      });

    const { data, message, success } = await GetLinksBySearchKeyword({
      page: pageNumber,
      searchKeyword: search,
      userId: session.user.id,
    });

    return (
      <MainPageTourGuide
        urls={data ? data : []}
        session={session}
        currentPage={pageNumber}
        totalPageNumber={totalPageNumber}
      />
    );
  }

  const { data: TotalUrlData } = await GetTotalUrl({ userId: session.user.id });

  // validated current page number
  const { currentPageNumber: pageNumber, totalPageNumber } = ValidatePageNumber(
    {
      totalData: TotalUrlData,
      page,
    }
  );

  const { data, message, success } = await GetLinksByPage({
    page: pageNumber,
    userId: session.user.id,
  });

  return (
    <MainPageTourGuide
      urls={data ? data : []}
      session={session}
      currentPage={pageNumber}
      totalPageNumber={totalPageNumber}
    />
  );
}
