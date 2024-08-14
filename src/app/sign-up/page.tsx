import SignUpForm from "@/components/auth/signup-form";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";

const SignUpPage = () => {
  return (
    <div className="overflow-hidden h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={null} />

        {/* signin form */}
        <div>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
