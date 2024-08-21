"use client";

import { ChangeVaultCode } from "@/servers/vault/change-vault-code";
import { ResetVaultCode } from "@/servers/vault/reset-vault-code";
import React, { useTransition } from "react";
import toast from "react-hot-toast";
import { PiPassword } from "react-icons/pi";
import ButtonWithSpinner from "./button-with-spinner";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type VaultCodeChangeProps = {
  isPending: boolean;
};

const VaultCodeChange = (props: VaultCodeChangeProps) => {
  const { isPending: isPendingProfileUpdateForm } = props;

  const [oldVaultCode, setOldVaultCode] = React.useState("");
  const [newVaultCode, setNewVaultCode] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const [isResetVaultCodePending, startResetVaultCodeTransition] =
    useTransition();

  function handleChangeVaultCodeClick() {
    startTransition(async () => {
      if (oldVaultCode.length === 6 && newVaultCode.length === 6) {
        const { message, success } = await ChangeVaultCode(
          oldVaultCode,
          newVaultCode
        );

        if (success) {
          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} />
          ));
          setOpenDialog(false);
        }

        if (!success) {
          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} error />
          ));
        }
      } else {
        toast.custom((t) => (
          <LinkLockerToastJSX
            t={t}
            toastMessage={"Old Code and New Code length must be 6 digit"}
            error
          />
        ));
      }
    });
  }

  function handleResetVaultCodeClick() {
    startResetVaultCodeTransition(async () => {
      const { message, success } = await ResetVaultCode();

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));
        setOpenDialog(false);
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
        <Button
          disabled={isPending || isPendingProfileUpdateForm}
          className="w-fit mt-4 h-10 md:h-12 text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300"
        >
          <span className="flex items-center gap-x-2">
            <PiPassword size={20} />
            Change Vault Code
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-12 py-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Change Vault Code
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="mx-auto">
          <p>Enter your Old Vault Code</p>
          <InputOTP
            value={oldVaultCode}
            onChange={(value) => setOldVaultCode(value)}
            maxLength={6}
            minLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>{" "}
        </div>
        <div className="mx-auto">
          <p>Enter your New Vault Code</p>
          <InputOTP
            maxLength={6}
            minLength={6}
            value={newVaultCode}
            onChange={(value) => setNewVaultCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>{" "}
        </div>

        <div className="flex mt-4 justify-between items-center">
          <ButtonWithSpinner
            onClick={handleChangeVaultCodeClick}
            isPending={isPending}
            otherComponentPendingState={isResetVaultCodePending}
            title="Change Vault Code"
            buttonClass="w-fit px-9"
          />
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isPending || isResetVaultCodePending}
            variant={"secondary"}
            className="h-12"
          >
            Cancel
          </Button>
        </div>

        {/* reset vault code dialog. start */}
        <div className="flex justify-end">
          <ButtonWithSpinner
            onClick={handleResetVaultCodeClick}
            title="Reset Vault Code"
            isPending={isResetVaultCodePending}
            otherComponentPendingState={isPending}
            buttonClass="bg-transparent hover:bg-transparent w-fit px-9 underline underline-offset-4 text-stone-800 dark:text-stone-400"
          />
        </div>
        {/* reset vault code dialog. end */}
      </DialogContent>
    </Dialog>
  );
};

export default VaultCodeChange;
