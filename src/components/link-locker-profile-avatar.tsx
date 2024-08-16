"use client";

import {
  LinkLockerLogoutPage,
  LinkLockerPrivateLinkRoute,
  LinkLockerProfileRoute,
  LinkLockerSignInPage,
} from "@/constants/routes";
import { DropdownMenuItemStyle } from "@/constants/tailwind";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import nProgress from "nprogress";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { PiVaultFill } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

type LinkLockerProfileAvatarProps = {
  authUserImage: string | null | undefined;
};

const LinkLockerProfileAvatar = (props: LinkLockerProfileAvatarProps) => {
  const { authUserImage } = props;

  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();

  async function handleSignout() {
    // await signOut({ callbackUrl: LinkLockerSignInPage, redirect: false });
    router.push(LinkLockerLogoutPage);

    nProgress.start();
  }

  return (
    <>
      <DropdownMenu open={openDialog} onOpenChange={setOpenDialog}>
        <DropdownMenuTrigger asChild>
          {!authUserImage ? (
            <div className="h-10 w-10 rounded-full bg-sky-500 text-lg flex justify-center items-center cursor-pointer text-white uppercase font-semibold">
              <FaUserCircle size={25} />
            </div>
          ) : (
            <div
              className="h-10 w-10 relative"
              onClick={() => setOpenDialog(true)}
            >
              <Image
                className="rounded-full cursor-pointer"
                src={`${authUserImage}?v=2`}
                alt="User image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="dark:bg-stone-900 dark:contrast-[.85]">
          <Link href={LinkLockerProfileRoute}>
            <DropdownMenuItem asChild className={cn(DropdownMenuItemStyle)}>
              <div className="flex justify-between items-center w-full">
                Profile
                <CgProfile />
              </div>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className={DropdownMenuItemStyle} asChild>
            <Link
              href={LinkLockerPrivateLinkRoute}
              className="flex justify-between items-center w-full"
            >
              Vault
              <PiVaultFill />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleSignout();
            }}
            className={DropdownMenuItemStyle}
          >
            <div className="flex justify-between items-center w-full">
              Logout
              <IoMdLogOut />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LinkLockerProfileAvatar;
