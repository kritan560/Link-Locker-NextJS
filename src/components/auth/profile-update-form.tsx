"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ProfileUpdateSchema,
  ProfileUpdateSchemaType,
} from "@/schemas/profile-update-schema";
import { ProfileUpdateServer } from "@/servers/profile-update-server";
import { User } from "next-auth";
import { ProviderType } from "next-auth/providers";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ChangeCredentialPassword from "../change-credential-password";
import VaultCodeChange from "../change-vault-code";
import LinkLockerFormItem from "../link-locker-formitem";
import RemoveAccount from "../remove-account";
import { LinkLockerToastJSX } from "../toast/link-locker-toast";

type ProfileUpdateFormProps = {
  name: User["name"];
  email: User["email"];
  currentAuthUserAccountType: ProviderType | undefined;
};

export function ProfileUpdateForm(props: ProfileUpdateFormProps) {
  const { email, name, currentAuthUserAccountType } = props;

  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<ProfileUpdateSchemaType>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: name ?? "",
      email: email ?? "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: ProfileUpdateSchemaType) {
    startTransition(async () => {
      const { message, success } = await ProfileUpdateServer(values);

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
      }
    });
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-4 md:justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <LinkLockerFormItem
                field={field}
                placeholder="Please Fill Your Name"
                type="text"
                formLabel="Name"
                disabled={isPending}
              />
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <LinkLockerFormItem
                showTooltip={true}
                disabled={true}
                field={field}
                formLabel="Email"
                placeholder="Enter Email"
                type="email"
              />
            )}
          />
        </div>
        <Button
          disabled={isPending}
          className="w-full h-10 md:h-12 text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300"
          type="submit"
        >
          <span className="relative">
            Update Profile{" "}
            <span className="text-inherit inline absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full">
              <AiOutlineLoading3Quarters
                className={cn(isPending ? "block animate-spin" : "hidden")}
              />
            </span>
          </span>
        </Button>
      </form>

      <div className="md:flex-row flex-col justify-between items-center mt-3">
        <VaultCodeChange isPending={isPending} />

        <ChangeCredentialPassword
          currentAuthUserAccountType={currentAuthUserAccountType}
          isPending={isPending}
        />
      </div>

      <div className="mt-3 flex justify-end items-center">
        <RemoveAccount isPending={isPending} />
      </div>
    </Form>
  );
}
