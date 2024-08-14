import { auth } from "@/auth";
import PrivateLinkComponent from "@/components/auth/private-link-component";
import { GetPrivateLinks } from "@/servers/link/get-private-links";

const PrivateLinkPage = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const userId = session.user.id;
  const { data: urls } = await GetPrivateLinks(userId);

  return (
    <PrivateLinkComponent
      session={session}
      urls={urls}
    />
  );
};

export default PrivateLinkPage;
