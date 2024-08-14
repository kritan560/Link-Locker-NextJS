"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkLockerBackgroundColorStyle } from "@/constants/background-color";
import {
  RequestCredentialPasswordResetSchemaType,
  requestCredentialPasswordResetSchema,
} from "@/schemas/request-credential-password-reset-schema";
import { RequestCredentialPasswordResetTokenServer } from "@/servers/request-credentails-password-reset-token-server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ButtonWithSpinner from "./button-with-spinner";
import LinkLockerFormItem from "./link-locker-formitem";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";

type RequestCredentialPasswordResetFormProps = {
  isPending: boolean;
};

const RequestCredentialPasswordResetForm = (
  props: RequestCredentialPasswordResetFormProps
) => {
  const { isPending } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [isResetPasswordPending, startResetPasswordTransition] =
    useTransition();

  const requestCredentialPasswordResetForm =
    useForm<RequestCredentialPasswordResetSchemaType>({
      resolver: zodResolver(requestCredentialPasswordResetSchema),
      defaultValues: {
        email: "",
      },
    });

  // 2. Define a submit handler.
  function resetPassword(values: RequestCredentialPasswordResetSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startResetPasswordTransition(async () => {
      const { data, message, success } =
        await RequestCredentialPasswordResetTokenServer(values.email);

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));
        setOpenDialog(false);
        requestCredentialPasswordResetForm.reset();
      }

      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error />
        ));
        setOpenDialog(false);
        requestCredentialPasswordResetForm.reset();
      }
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"link"} disabled={isResetPasswordPending || isPending}>
          reset password
        </Button>
      </DialogTrigger>
      <DialogContent className={LinkLockerBackgroundColorStyle}>
        <DialogHeader>
          <DialogTitle className="text-center">Reset Password</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* reset password form */}
        <Form {...requestCredentialPasswordResetForm}>
          <form
            onSubmit={requestCredentialPasswordResetForm.handleSubmit(
              resetPassword
            )}
            className="space-y-8"
          >
            <FormField
              control={requestCredentialPasswordResetForm.control}
              name="email"
              render={({ field }) => (
                <LinkLockerFormItem
                  field={field}
                  placeholder="Enter Email"
                  disabled={isResetPasswordPending}
                  formLabel="Email"
                  type="email"
                  description="Enter Your Email. The reset password link will be sent to your email"
                  showInputShadow={false}
                />
              )}
            />
            <ButtonWithSpinner
              isPending={isResetPasswordPending}
              title="Reset Password"
              type="submit"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCredentialPasswordResetForm;
