import SignInForm from "@/components/auth/signin-form";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";

const SignInPage = async () => {
  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={null} />

        {/* signin form */}
        <div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
