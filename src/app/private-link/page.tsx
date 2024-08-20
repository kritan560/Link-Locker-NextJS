import { auth } from "@/auth";
import PrivateLinkComponent from "@/components/auth/private-link-component";
import { ValidatePageNumber } from "@/helpers/validate-page-number";
import {
  GetPrivateLinksByPage,
  GetPrivateLinksBySearchKeyword,
  GetTotalPrivateUrl,
  GetTotalPrivateUrlOfSearchedKeyword,
} from "@/servers/link/get-private-links";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: "Private Link",
};

type PrivateLinkPageProps = {
  searchParams: { page: string; search: string };
};

const PrivateLinkPage = async (props: PrivateLinkPageProps) => {
  const {
    searchParams: { page, search },
  } = props;

  const session = await auth();

  if (!session) {
    return null;
  }

  if (search) {
    const { data: TotalUrlData } = await GetTotalPrivateUrlOfSearchedKeyword({
      userId: session.user.id,
      searchKeyword: search,
    });

    // validated current page number
    const { currentPageNumber: pageNumber, totalPageNumber } =
      ValidatePageNumber({
        totalData: TotalUrlData,
        page,
      });

    const { data, message, success } = await GetPrivateLinksBySearchKeyword({
      page: pageNumber,
      searchKeyword: search,
      userId: session.user.id,
    });

    return (
      <PrivateLinkComponent
        currentPage={pageNumber}
        totalPageNumber={totalPageNumber}
        session={session}
        urls={data ? data : []}
      />
    );
  }

  const { data: TotalUrlData } = await GetTotalPrivateUrl({
    userId: session.user.id,
  });

  // validated current page number
  const { currentPageNumber: pageNumber, totalPageNumber } = ValidatePageNumber(
    {
      totalData: TotalUrlData,
      page,
    }
  );

  const { data, message, success } = await GetPrivateLinksByPage({
    page: pageNumber,
    userId: session.user.id,
  });

  return (
    <PrivateLinkComponent
      currentPage={pageNumber}
      totalPageNumber={totalPageNumber}
      session={session}
      urls={data ? data : []}
    />
  );
};

export default PrivateLinkPage;
