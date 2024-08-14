"use client";

import { LinkLockerSignInPage } from "@/constants/routes";
import {
  ResetCredentialPasswordSchemaType,
  resetCredentialPasswordSchema,
} from "@/schemas/reset-credential-password-schema";
import { ResetCredentialPasswordServer } from "@/servers/reset-credential-password-server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonWithSpinner from "./button-with-spinner";
import LinkLockerFormItem from "./link-locker-formitem";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";
import { Form, FormField } from "./ui/form";

type ResetCredentialPasswordFormProps = {
  token: string;
};

const ResetCredentialPasswordForm = (
  props: ResetCredentialPasswordFormProps
) => {
  const { token } = props;
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetCredentialPasswordSchemaType>({
    resolver: zodResolver(resetCredentialPasswordSchema),
    defaultValues: {
      Password: "",
      ConfirmPassword: "",
    },
  });

  function onSubmit(values: ResetCredentialPasswordSchemaType) {
    startTransition(async () => {
      const { data, message, success } = await ResetCredentialPasswordServer(
        values,
        token
      );

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));

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
    <Suspense>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="Password"
            render={({ field }) => (
              <LinkLockerFormItem
                disabled={isPending}
                type="password"
                placeholder="Enter Your New Password"
                field={field}
                formLabel="New Password"
                showInputShadow
              />
            )}
          />

          <FormField
            control={form.control}
            name="ConfirmPassword"
            render={({ field }) => (
              <LinkLockerFormItem
                disabled={isPending}
                type="password"
                placeholder="Enter Your Confirmed Password"
                field={field}
                formLabel="Confirm Password"
                showInputShadow
              />
            )}
          />

          <ButtonWithSpinner isPending={isPending} title="Reset Password" />
        </form>
      </Form>
    </Suspense>
  );
};

export default ResetCredentialPasswordForm;
