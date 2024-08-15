import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import ResetCredentialPasswordForm from "@/components/reset-credential-password-form";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: 'Reset Credential Password',
}

type ResetCredentialPasswordPageProps = {
  searchParams: { token: string };
};

const ResetCredentialPasswordPage = (
  props: ResetCredentialPasswordPageProps
) => {
  const {
    searchParams: { token },
  } = props;

  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={null} />

        {/* reset credential password form */}
        <div>
          <ResetCredentialPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
};

export default ResetCredentialPasswordPage;
