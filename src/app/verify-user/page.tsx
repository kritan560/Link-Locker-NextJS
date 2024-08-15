import { auth } from "@/auth";
import VerifyUserOTP from "@/components/auth/verify-user-otp";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: 'Verify User',
}

const VerifyUserPage = async () => {
  const session = await auth()
  
  return (
    <div className="overflow-hidden h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={session}/>

        {/* signin form */}
        <div className="flex h-[60%]">
          <VerifyUserOTP />
        </div>
      </div>
    </div>
  );
};

export default VerifyUserPage;
