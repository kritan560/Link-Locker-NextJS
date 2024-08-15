import StagingOauthUser from "@/components/staging-oauth-user";
import { Metadata } from "next";
import React from "react";

// either Static metadata
export const metadata: Metadata = {
  title: "Staging OAuth User",
};

const StagingOauthPage = () => {
  return <StagingOauthUser />;
};

export default StagingOauthPage;
