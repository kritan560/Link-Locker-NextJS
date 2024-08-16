import { auth } from "@/auth";
import MainPageTourGuide from "@/components/main-page-tour-guide";
import { GetLinks } from "@/servers/link/get-links";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: "Link Locker",
};

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return;
  }

  const userId = session.user.id;
  const { data: urls } = await GetLinks(userId);

  return <MainPageTourGuide session={session} urls={urls} />;
}
