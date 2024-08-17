"use client";

import { LinkLockerPrivateLinkRoute } from "@/constants/routes";
import {
  CopyToClipboardStyle,
  DropdownMenuItemStyle,
} from "@/constants/tailwind";
import { cn } from "@/lib/utils";
import { BlurLink } from "@/servers/link/blur-link";
import { BlurPrivateLink } from "@/servers/link/blur-private-link";
import { DeleteLink } from "@/servers/link/delete-link";
import { DeletePrivateLink } from "@/servers/link/delete-private-link";
import { MakeLinkPrivate } from "@/servers/link/make-link-private";
import { MakeLinkUnPrivate } from "@/servers/link/make-link-unprivate";
import { Url } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useOptimistic, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsReddit, BsThreeDots, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import {
  FaFacebook,
  FaLinkedin,
  FaLockOpen,
  FaRegCopy,
  FaRegEye,
} from "react-icons/fa6";
import { IoMdShareAlt } from "react-icons/io";
import { MdBlurOn, MdDelete, MdEmail } from "react-icons/md";
import { SiPrivateinternetaccess } from "react-icons/si";
import {
  getFacebookURL,
  getLinkedinURL,
  getRedditShareURL,
  getWhatsAppShareURL,
  getXShareURL,
} from "../helpers/get-share-encoded-url";
import LinkLockerTooltip from "./link-locker-tooltip";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

type LinkComponentProps = {
  content: Url;
  showFallbackOptions?: boolean;
};

/**
 * This component will handle the state of tooltip, linkcopied, linkcopiedAnimation
 * @param props - The LinkComponentProps
 * @returns
 */
const LinkComponent = (props: LinkComponentProps) => {
  const { content, showFallbackOptions = false } = props;

  const router = useRouter();
  const pathname = usePathname();

  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [optimisticContent, addOptimisticContent] = useOptimistic(
    content,
    (state, action: Url) => ({ ...state, ...action })
  );

  if (copied) {
    setCopied(false);
  }

  function handleCopyClipboard() {
    setCopied(true);
    toast.custom((t) => (
      <LinkLockerToastJSX t={t} toastMessage="Link copied to clipboard" />
    ));
  }

  /**
   * This function will delete the Links based on where it is. meaning
   * if link in private it will delete from private link
   * @returns
   */
  async function handleLinkDelete() {
    startTransition(() => {
      addOptimisticContent({ ...optimisticContent, url: "" });
    });

    if (pathname.startsWith(LinkLockerPrivateLinkRoute)) {
      const { data, message, success } = await DeletePrivateLink(
        optimisticContent.id
      );

      if (success) {
        router.refresh();
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }

      return;
    }

    const { data, message, success } = await DeleteLink(optimisticContent.id);

    if (success) {
      router.refresh();
    }

    if (!success) {
      toast.custom((t) => (
        <LinkLockerToastJSX t={t} toastMessage={message} error />
      ));
    }
  }

  /**
   * This function will toggle the blur field of a document based on where document meaning : if document is on private-link schema then it will toggle the blur state of that private state schema not public one
   * @returns
   */
  async function handleBlurToggleClick() {
    addOptimisticContent({
      ...optimisticContent,
      blur: !optimisticContent.blur,
    });

    if (pathname.startsWith(LinkLockerPrivateLinkRoute)) {
      const { data, message, success } = await BlurPrivateLink(
        optimisticContent
      );

      if (success) {
        router.refresh();
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }

      return;
    }

    const { data, message, success } = await BlurLink(optimisticContent);

    if (success) {
      router.refresh();
    }

    if (!success) {
      toast.custom((t) => (
        <LinkLockerToastJSX t={t} toastMessage={message} error />
      ));
    }
  }

  /**
   * This function will write the text to the clipboard
   * @param text - Text to be copied
   */
  async function writeClipboardText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.custom((t) => (
        <LinkLockerToastJSX t={t} toastMessage="URL copied to clipboard" />
      ));
    } catch (error) {
      toast.custom((t) => (
        <LinkLockerToastJSX
          t={t}
          toastMessage="Something went wrong unexpectdly"
          error
        />
      ));
      // console.error(error);
    }
  }

  /**
   * This function will toggle links from private to unprivate and vice-versa
   * @returns
   */
  async function handleMakeLinkPrivate() {
    addOptimisticContent({ ...optimisticContent, url: "" });

    if (pathname.startsWith(LinkLockerPrivateLinkRoute)) {
      const { data, message, success } = await MakeLinkUnPrivate(
        optimisticContent
      );

      if (success) {
        router.refresh();
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }

      return;
    }

    const { data, message, success } = await MakeLinkPrivate(optimisticContent);

    if (success) {
      router.refresh();
    }

    if (!success) {
      toast.custom((t) => (
        <LinkLockerToastJSX t={t} toastMessage={message} error />
      ));
    }
  }

  return (
    <>
      {optimisticContent.url.length > 0 && (
        <>
          <div className="flex justify-between gap-x-4 items-center bg-stone-800 rounded-full py-2 px-4">
            <LinkLockerTooltip
              contentBlur={optimisticContent?.blur}
              content={optimisticContent.url}
            >
              {optimisticContent?.url}
            </LinkLockerTooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-[2px] cursor-pointer">
                  <BsThreeDots size={20} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-stone-900 dark:contrast-[.85]">
                <DropdownMenuLabel className="text-center">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <CopyToClipboard
                  text={optimisticContent.url}
                  onCopy={handleCopyClipboard}
                >
                  <DropdownMenuItem className={DropdownMenuItemStyle}>
                    <div className="flex justify-between items-center w-full transition  cursor-pointer">
                      <p className="">Copy</p>
                      <FaRegCopy className="" />
                    </div>
                  </DropdownMenuItem>
                </CopyToClipboard>
                <DropdownMenuItem
                  id="dropdownmenuitem-share-id"
                  className={DropdownMenuItemStyle}
                  onClick={() => setDialogOpen(true)}
                >
                  <div
                    className={cn(CopyToClipboardStyle, DropdownMenuItemStyle)}
                  >
                    <p>Share</p>
                    <IoMdShareAlt className="" />
                  </div>
                </DropdownMenuItem>
                {/* doesn't show this dropdown as fallback options */}
                {!showFallbackOptions && (
                  <DropdownMenuItem
                    onClick={handleBlurToggleClick}
                    className={DropdownMenuItemStyle}
                  >
                    <div className={CopyToClipboardStyle}>
                      <p className="">
                        {optimisticContent?.blur ? "Un-Blur" : "Blur"}
                      </p>
                      <MdBlurOn className="" />
                    </div>
                  </DropdownMenuItem>
                )}{" "}
                {!showFallbackOptions && (
                  <DropdownMenuItem
                    onClick={handleMakeLinkPrivate}
                    className={DropdownMenuItemStyle}
                  >
                    {!pathname.startsWith(LinkLockerPrivateLinkRoute) ? (
                      <div className={CopyToClipboardStyle}>
                        <p className="">Private</p>
                        <SiPrivateinternetaccess className="" />
                      </div>
                    ) : (
                      <div className={CopyToClipboardStyle}>
                        <p className="">Un-Private</p>
                        <FaLockOpen className="" />
                      </div>
                    )}
                  </DropdownMenuItem>
                )}{" "}
                <DropdownMenuItem className={DropdownMenuItemStyle} asChild>
                  <Link
                    target="_blank"
                    href={optimisticContent.url}
                    className={CopyToClipboardStyle}
                  >
                    <p className="">Visit</p>
                    <FaRegEye />
                  </Link>
                </DropdownMenuItem>
                {!showFallbackOptions && (
                  <DropdownMenuItem
                    onClick={handleLinkDelete}
                    className={
                      "text-red-500 active:text-red-600 duration-200 transition"
                    }
                  >
                    <div className={CopyToClipboardStyle}>
                      <p className="">Delete</p>
                      <MdDelete className="" />
                    </div>
                  </DropdownMenuItem>
                )}{" "}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dialog Component */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-[425px] md:max-w-[700px]">
              <div className="space-y-6">
                <p className="text-2xl font-medium">Share</p>

                {/* logos */}
                <div className="overflow-x-auto w-[375px] md:w-full">
                  <div className="flex gap-x-6 justify-between items-center mt-6">
                    {/* TODO : Update the reddit url title to production lInk locker url */}
                    <Link
                      target="_blank"
                      href={getRedditShareURL(
                        "Link Locker Save Your Links",
                        optimisticContent.url
                      )}
                    >
                      <BsReddit size={55} />
                    </Link>
                    <Link
                      target="_blank"
                      href={getWhatsAppShareURL(optimisticContent.url)}
                    >
                      <BsWhatsapp size={55} />
                    </Link>
                    <Link
                      target="_blank"
                      href={getXShareURL(optimisticContent.url)}
                    >
                      <BsTwitterX size={55} />
                    </Link>
                    <Link
                      target="_blank"
                      href={getLinkedinURL(optimisticContent.url)}
                    >
                      <FaLinkedin size={55} />
                    </Link>
                    <Link
                      target="_blank"
                      href={getFacebookURL(optimisticContent.url)}
                    >
                      <FaFacebook size={55} />
                    </Link>
                    <Link
                      target="_blank"
                      href={`mailto:johndoe@gmail.com &subject=Sharing URL using Link Locker &body=This is the shared URL form link locker : ${optimisticContent.url}`}
                    >
                      <MdEmail size={55} />
                    </Link>
                  </div>
                </div>

                {/* link */}
                <div className="flex gap-y-2 md:gap-x-5 items-center flex-col md:flex-row">
                  <Input
                    value={optimisticContent.url}
                    disabled
                    className="h-12 w-full"
                  />
                  <Button
                    onClick={async () =>
                      writeClipboardText(optimisticContent.url)
                    }
                    className="rounded-full h-12 flex justify-center items-center px-6 text-white bg-sky-500 transition active:bg-sky-500 hover:bg-sky-600 w-full md:w-fit"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default LinkComponent;
