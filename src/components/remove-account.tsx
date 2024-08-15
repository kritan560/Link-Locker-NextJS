"use client";

import { LinkLockerBackgroundColorStyle } from "@/constants/background-color";
import { LinkLockerLogoutPage, LinkLockerSignInPage } from "@/constants/routes";
import { RemoveAccountServer } from "@/servers/remove-account-server";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type RemoveAccountProps = {
  isPending: boolean;
};

const RemoveAccount = (props: RemoveAccountProps) => {
  const { isPending: isPendingParent } = props;

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);

  async function handleAccountRemoveClick() {
    startTransition(async () => {
      nProgress.start();
      const { message, success } = await RemoveAccountServer();

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));

        if (message === "Account Deleted Successfully") {
          // await signOut({ callbackUrl: LinkLockerSignInPage, redirect: false });
          router.push(LinkLockerLogoutPage);
        }

        router.push(LinkLockerSignInPage);
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button disabled={isPending || isPendingParent} variant={"link"}>
          Remove Account
        </Button>
      </DialogTrigger>

      <DialogContent className={LinkLockerBackgroundColorStyle}>
        <DialogHeader>
          <DialogTitle className="text-rose-600">Remove Account</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <h1 className="text-2xl font-semibold text-center">
          Are you sure you want to Remove{" "}
          <span className="text-sky-500 font-bold">Link</span>{" "}
          <span className="text-foreground">Locker</span> Account?
        </h1>
        <p className="text-sm text-center ">
          All the links that you have stored in this account will be deleted?
          there are no backups...
        </p>

        <div className="flex justify-between items-center mt-3">
          <Button
            onClick={handleAccountRemoveClick}
            disabled={isPending || isPendingParent}
            className="h-12"
            variant={"destructive"}
          >
            Yes Remove
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isPending || isPendingParent}
            className="h-12"
            variant={"outline"}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveAccount;
