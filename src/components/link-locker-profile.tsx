"use client";

import React from "react";
import LinkLockerLeftComponent from "./link-locker-left-component";
import LinkLockerRightNavbar from "./link-locker-right-navbar";
import { ProfileUpdateForm } from "./auth/profile-update-form";
import { Session } from "next-auth";
import { ProviderType } from "next-auth/providers";

type LinkLockerProfileProps = {
  session: Session;
  currentAuthUserAccountType: ProviderType | undefined;
  email: string | null | undefined;
  authUserName: string | null | undefined;
};

const LinkLockerProfile = (props: LinkLockerProfileProps) => {
  const { currentAuthUserAccountType, session, email, authUserName } = props;

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

export default LinkLockerProfile;
