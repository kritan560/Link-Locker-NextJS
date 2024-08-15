"use client";

import { signOut } from "next-auth/react";
import React, { useEffect, useTransition } from "react";

const LogoutPage = () => {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await signOut();
    });
  }, []);

  return <div></div>;
};

export default LogoutPage;
