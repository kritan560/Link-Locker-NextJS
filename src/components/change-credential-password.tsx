"use client";

import { Form, FormField } from "@/components/ui/form";
import {
  ChangeCredentailPasswordSchema,
  ChangeCredentailPasswordSchemaType,
} from "@/schemas/change-credential-password-schema";
import { ChangeCredentialPasswordServer } from "@/servers/change-credentails-password-server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PiPassword } from "react-icons/pi";
import ButtonWithSpinner from "./button-with-spinner";
import LinkLockerFormItem from "./link-locker-formitem";
import LinkLockerTooltip from "./link-locker-tooltip";
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

type ChangeCredentialPasswordProps = {
  currentAuthUserAccountType: Session["user"]["type"] | undefined;
  isPending: boolean;
};

const ChangeCredentialPassword = (props: ChangeCredentialPasswordProps) => {
  const { currentAuthUserAccountType, isPending: isPendingProfileUpdateForm } =
    props;

  const disableChangePasswordButton =
    currentAuthUserAccountType !== "credentials";

  const [isPending, startTranstion] = useTransition();
  const [openDialog, setOpenDialog] = React.useState(false);

  // 1. Define your form.
  const form = useForm<ChangeCredentailPasswordSchemaType>({
    resolver: zodResolver(ChangeCredentailPasswordSchema),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: ChangeCredentailPasswordSchemaType) {
    startTranstion(async () => {
      const { message, success } = await ChangeCredentialPasswordServer(
        values.oldPassword,
        values.newPassword
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
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <LinkLockerTooltip
        tooltipTriggerClass="w-fit"
        showTooltipContent={disableChangePasswordButton}
        content="Cannot change OAuth account password"
      >
        <DialogTrigger asChild>
          <Button
            disabled={
              disableChangePasswordButton ||
              isPending ||
              isPendingProfileUpdateForm
            }
            className="w-fit mt-4 h-12 text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300"
          >
            <span className="flex items-center gap-x-2">
              <PiPassword size={21} />
              Change password
            </span>
          </Button>
        </DialogTrigger>
      </LinkLockerTooltip>
      <DialogContent className="px-12 py-8 bg-gradient-to-b from-stone-300/50 to-stone-300 dark:bg-gradient-to-b dark:from-stone-800/60 dark:to-stone-800 dark:text-white shadow-lg shadow-stone-400 dark:shadow-stone-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Change Credentail Password
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* chage password form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <LinkLockerFormItem
                  disabled={isPending}
                  field={field}
                  placeholder="Old Password"
                  type="password"
                />
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <LinkLockerFormItem
                  disabled={isPending}
                  field={field}
                  placeholder="New Password"
                  type="password"
                />
              )}
            />
            <div className="flex mt-4 justify-between items-center">
              {/* <Button
                disabled={isPending}
                type="submit"
                className="w-fit h-12 text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300"
              >
                Change password
              </Button> */}
              <ButtonWithSpinner
                isPending={isPending}
                title="Change Password"
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeCredentialPassword;
