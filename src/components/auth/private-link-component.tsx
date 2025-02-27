"use client";

import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LinkLockerBackgroundColorStyle } from "@/constants/background-color";
import { LinkLockerHomepage } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { GetVaultCode } from "@/servers/vault/get-vault-code";
import { Url } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import { useOptimistic, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Oval } from "react-loader-spinner";
import LinkComponent from "../link-locker-link-component";
import { LinkLockerToastJSX } from "../toast/link-locker-toast";
import { Input } from "../ui/input";

type PrivateLinkComponentProps = {
  urls: Url[];
  session: Session;
  currentPage: number;
  totalPageNumber: number;
};

const PrivateLinkComponent = (props: PrivateLinkComponentProps) => {
  const { session, urls, currentPage, totalPageNumber } = props;

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const [isVaultOpen, setVaultOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(true);
  const [vaultCode, setVaultCode] = useState("");
  const [callBackend, setCallbackend] = useState(false);
  const [isPending, setPending] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [optimisticPrivateLinks, addOptimisticPrivateLink] = useOptimistic(
    urls,
    (state, action: Url[]) => [...state, ...action]
  );

  function handleCancelClick() {
    router.push(LinkLockerHomepage);
    nProgress.start();
  }

  // check if the user typed code is correct or not
  async function compareVaultCode() {
    setPending(true);

    const { data: hashedVaultCode } = await GetVaultCode(session.user.id);

    if (!hashedVaultCode?.code) {
      return;
    }

    const isCodeCorrect = await bcrypt.compare(vaultCode, hashedVaultCode.code);

    if (isCodeCorrect) {
      setVaultOpen(true);
    }

    if (!isCodeCorrect) {
      toast.custom((t) => (
        <LinkLockerToastJSX t={t} toastMessage={"Code did not match"} error />
      ));
    }

    setPending(false);
  }

  if (vaultCode.length === 6 && callBackend) {
    // TODO : check if code is correct. via backend call and if code is correct change the isValueOpen state to true. only then display the private link.

    compareVaultCode();
    setCallbackend(false);
  }

  function handleRightArrowClick() {
    if (searchParams.get("search")) {
      router.push(`?search=${searchValue}&page=${currentPage + 1}`);

      nProgress.start();
      return;
    }

    router.push(`?page=${currentPage + 1}`);
    nProgress.start();
  }

  function handleLeftArrowClick() {
    if (searchParams.get("search")) {
      router.push(`?search=${searchValue}&page=${currentPage - 1}`);

      nProgress.start();
      return;
    }

    router.push(`?page=${currentPage - 1}`);
    nProgress.start();
  }

  function handleFiSearchClick() {
    setShowTitle(false);
    if (!showTitle) {
      router.push(`?search=${searchValue}`);
      nProgress.start();
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 99);
  }

  if (isVaultOpen) {
    return (
      <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
        {/* left size */}
        <LinkLockerLeftComponent
          addOptimisticUrls={addOptimisticPrivateLink}
          showButton={!!session}
        />

        {/* right side */}
        <div className="md:w-[45%] w-full min-w-[250px] p-2">
          <LinkLockerRightNavbar
            addOptimisticUrls={addOptimisticPrivateLink}
            session={session}
          />

          {/* links card */}
          <div className=" rounded-2xl px-6 bg-gray-50 dark:bg-stone-700 mt-2 h-[calc(100vh-170px)] relative  overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-sky-400 active:scrollbar-thumb-sky-500 shadow-md shadow-stone-400 dark:shadow-stone-600">
            <div
              className={cn(
                "flex sticky top-0 justify-between items-center gap-x-3 py-2 bg-inherit z-10"
              )}
            >
              <div className="flex gap-x-3 items-center">
                <FaArrowCircleLeft
                  onClick={handleLeftArrowClick}
                  size={21}
                  className={cn(
                    "cursor-pointer",
                    currentPage <= 0 &&
                      "opacity-30 pointer-events-none cursor-not-allowed"
                  )}
                />
                <BsAlphabetUppercase
                  size={21}
                  className="cursor-pointer"
                  onClick={() => setShowTitle(true)}
                />
              </div>

              {showTitle ? (
                <div className="text-center h-10 z-10 bg-gray-50 dark:bg-stone-700 font-semibold text-lg scale-105 sticky top-0 flex items-center">
                  {optimisticPrivateLinks.length > 0 ? (
                    <p>
                      {" "}
                      <span className="text-sky-500">Link</span> Locker Private
                      Links
                    </p>
                  ) : (
                    "Currently ther are no links Paste Some links"
                  )}
                </div>
              ) : (
                <Input
                  placeholder="Search Private Links"
                  ref={inputRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-10 bg-stone-800 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFiSearchClick();
                    }
                  }}
                />
              )}

              <div className="flex gap-x-3 items-center">
                <FiSearch
                  size={21}
                  className="cursor-pointer"
                  onClick={handleFiSearchClick}
                />

                <FaArrowCircleRight
                  onClick={handleRightArrowClick}
                  size={21}
                  className={cn(
                    "cursor-pointer",
                    currentPage >= totalPageNumber - 1 &&
                      "pointer-events-none opacity-30 cursor-not-allowed"
                  )}
                />
              </div>
            </div>

            {/* links */}
            <div className="text-white space-y-3 my-1">
              {optimisticPrivateLinks?.map((url) => (
                <LinkComponent key={url.id} content={url} />
              ))}
            </div>

            {/* this div is to make a padding at bottom : this should not be necessary when padding is given to parent element but it did not work as expecteded so this is a work around */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-stone-700 h-10 z-10 w-full scale-105"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={(boolean) => {
        setAlertDialogOpen(boolean);
        router.push(LinkLockerHomepage);
        nProgress.start();
      }}
    >
      <AlertDialogContent className={LinkLockerBackgroundColorStyle}>
        <AlertDialogHeader>
          <AlertDialogTitle>Vault code...</AlertDialogTitle>
          <AlertDialogDescription>
            This is a Vault to store your important links seperatly. Enter the
            code to unlock the vault
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className="text-center font-medium">Enter Your Vault Code :</p>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={vaultCode}
            onChange={(value) => {
              setVaultCode(value), setCallbackend(true);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot className="border border-stone-500" index={0} />
              <InputOTPSlot className="border border-stone-500" index={1} />
              <InputOTPSlot className="border border-stone-500" index={2} />
              <InputOTPSlot className="border border-stone-500" index={3} />
              <InputOTPSlot className="border border-stone-500" index={4} />
              <InputOTPSlot className="border border-stone-500" index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="relative h-8 mx-auto w-fit">
          <p
            className={cn(
              vaultCode.length >= 1 && vaultCode.length < 6 ? "block" : "hidden"
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

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelClick}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrivateLinkComponent;
