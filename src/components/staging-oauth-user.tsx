"use client";

import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import { LinkLockerToastJSX } from "@/components/toast/link-locker-toast";
import { LinkLockerHomepage } from "@/constants/routes";
import { CreateVaultCodeOAuthUser } from "@/servers/create-vault-code-oauth-user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

/**
 * This component is used to generate the Vault code for oauth user
 *
 * @returns
 */
const StagingOauthUser = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const { success, message } = await CreateVaultCodeOAuthUser();

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));
      }

      router.push(LinkLockerHomepage);
      nProgress.start();
    });
  }, [router]);

  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left side */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="w-full flex-1 py-12 px-8 space-y-10">
        <LinkLockerRightNavbar session={null} />

        <div className="flex justify-center items-center">
          <div className="md:h-52 md:w-52 h-36 w-36 relative">
            <Image
              src={"/LinkLockerLogo.png"}
              alt="Image Logo"
              fill
              className="animate-spin-slow"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <h1 className="text-center font-semibold text-2xl flex justify-center animate-pulse items-start gap-x-2">
          <span>Staging OAuth User </span>
          <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="#0EA5E9"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </h1>

        <p className="text-sm text-stone-600 dark:text-stone-300">
          This might take about 5-10 second. You will automatically be
          redirected to Link Locker Homepage please be patience
        </p>
        <span className="text-sm text-stone-600 dark:text-stone-300">
          Click{" "}
          <Link className="text-sky-500" href={LinkLockerHomepage}>
            Here
          </Link>{" "}
          if you are not redirected!!
        </span>
      </div>
    </div>
  );
};

export default StagingOauthUser;
