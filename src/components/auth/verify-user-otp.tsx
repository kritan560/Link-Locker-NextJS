"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LinkLockerSignInPage } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { VerifyUserOTPServer } from "@/servers/verify-user-otp-server";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { LinkLockerToastJSX } from "../toast/link-locker-toast";
import { Button } from "../ui/button";

const VerifyUserOTP = () => {
  const [callbackend, setCallbackend] = useState(true);
  const [value, setValue] = React.useState("");
  const [message, setMessage] = React.useState({
    message: "Enter your verificaiton code",
    error: false,
  });
  const [isPending, setPending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");

  async function VerifyUserOTP() {
    if (hash) {
      setPending(true);
      const { success, message } = await VerifyUserOTPServer(hash, value);

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));
        router.push(LinkLockerSignInPage);
        nProgress.start();
      }
      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error={true} />
        ));
        setMessage({ message: "verification code not match", error: true });
      }
      setPending(false);
    }
  }

  if (value.length === 6 && callbackend) {
    VerifyUserOTP();
    setCallbackend(false);
  }

  return (
    <>
      <div className=" my-auto w-fit mx-auto space-y-2">
        {/* <SignUpForm /> */}
        <InputOTP
          className=""
          maxLength={6}
          value={value}
          onChange={(value) => {
            setValue(value);
            setCallbackend(true);
          }}
        >
          {" "}
          <InputOTPGroup className="">
            <InputOTPSlot index={0} className="border-stone-500" />
            <InputOTPSlot index={1} className="border-stone-500" />
            <InputOTPSlot index={2} className="border-stone-500" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="border-stone-500" />
            <InputOTPSlot index={4} className="border-stone-500" />
            <InputOTPSlot index={5} className="border-stone-500" />
          </InputOTPGroup>
        </InputOTP>
        {/* <div className="text-center text-lg font-medium">
          <div className="relative">
            <AiOutlineLoading3Quarters
              className={cn(
                "opacity-0 transition absolute left-0 mt-[3px]",
                isPending && "animate-spin opacity-100"
              )}
            />
            <p className="">
              <span
                className={cn(
                  "opacity-0 absolute left-6",
                  isPending && "opacity-100"
                )}
              >
                Verifying...
              </span>
              <span
                className={cn(
                  "opacity-0 absolute left-0",
                  value.length < 6 && value.length >= 1 && "opacity-100"
                )}
              >
                Punching the code
              </span>
            </p>
          </div>
        </div> */}
        <div className="relative h-8 mx-auto w-fit">
          <p
            className={cn(
              value.length >= 1 && value.length < 6 ? "block" : "hidden"
            )}
          >
            Punching the vault code
          </p>
          <div
            className={cn(isPending ? "flex gap-x-2 items-center" : "hidden")}
          >
            <Oval
              visible={true}
              height="20"
              width="20"
              color="#0EA5E9"
              secondaryColor="rgba(0, 0, 0, 0.1)"
              strokeWidth={7}
              ariaLabel="oval-loading"
            />
            <p>Verifying...</p>
          </div>
        </div>

        <div className="h-20 flex items-end">
          <Link href={LinkLockerSignInPage} className="w-full">
            <Button className="w-full h-12  text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300">
              Sign-In
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerifyUserOTP;
