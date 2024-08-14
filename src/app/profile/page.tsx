import { auth } from "@/auth";
import { ProfileUpdateForm } from "@/components/auth/profile-update-form";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import { GetProfileDetail } from "@/servers/get-profile-detail";

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
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={!!session} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={session} />

        {/* profile update form */}
        <div>
          <ProfileUpdateForm
            email={email}
            name={authUserName}
            currentAuthUserAccountType={currentAuthUserAccountType}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
