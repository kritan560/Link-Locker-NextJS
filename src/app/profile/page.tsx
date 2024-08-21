import { auth } from "@/auth";
import { ProfileUpdateForm } from "@/components/auth/profile-update-form";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerProfile from "@/components/link-locker-profile";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import { GetProfileDetail } from "@/servers/get-profile-detail-server";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: "Profile Page",
};

const ProfilePage = async () => {
  const session = await auth();
  const email = session?.user.email;
  const currentAuthUserAccountType = session?.user.type;

  if (!email) {
    return null;
  }

  const { data } = await GetProfileDetail(email);
  const authUserName = data?.name;

  return (
    <LinkLockerProfile
      authUserName={authUserName}
      currentAuthUserAccountType={currentAuthUserAccountType}
      email={email}
      session={session}
    />
  );
};

export default ProfilePage;
