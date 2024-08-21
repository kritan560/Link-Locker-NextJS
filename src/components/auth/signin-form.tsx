"use client";

import { Form, FormField } from "@/components/ui/form";
import { LinkLockerHomepage, LinkLockerSignUpPage } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SignInSchema, SignInSchemaType } from "@/schemas/signin-schema";
import { SignInCredentialServer } from "@/servers/signin-server";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import ButtonWithSpinner from "../button-with-spinner";
import LinkLockerFormItem from "../link-locker-formitem";
import ResetPasswordForm from "../request-credential-password-reset-form";
import { LinkLockerToastJSX } from "../toast/link-locker-toast";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const SignInForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignInSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      try {
        const { message, success } = await SignInCredentialServer(values);
        if (!success) {
          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} error />
          ));
          if (message === "Register to continue") {
            router.push(LinkLockerSignUpPage);
            nProgress.start();
          }
        } else if (success) {
          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} />
          ));
          if (message === "Login successfully") {
            router.push(LinkLockerHomepage);
            nProgress.start();
          }
        }
      } catch (error) {
        // 
      }
    });
  }

  return (
    <>
      <div className="space-y-2">
        <div className="md:flex md:gap-x-2 md:items-center space-y-2 md:space-y-0">
          <Button
            onClick={() => {
              signIn("google");
            }}
            disabled={isPending}
            type="button"
            className={
              "flex h-12 w-full items-center gap-x-2 border border-stone-600 text-base hover:border-stone-500 hover:bg-stone-300 active:bg-stone-400 dark:hover:text-stone-800"
            }
            variant={"ghost"}
          >
            <FcGoogle size={30} />
            <p className="hidden sm:block">Login With Google</p>
          </Button>

          <Button
            onClick={() => {
              signIn("github");
            }}
            disabled={isPending}
            type="button"
            className={
              "h-12 border p-3 w-full md:w-fit hover:bg-stone-800 border-stone-600 hover:text-stone-50 active:bg-stone-700 text-base gap-x-2"
            }
            variant={"ghost"}
          >
            <FaGithub size={22} />
            <p className="md:hidden sm:block hidden">Login With Github</p>
          </Button>
        </div>

        <div className="py-5">
          <Separator className="relative h-[2px] bg-gray-800 w-full mx-auto">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 dark:bg-inherit truncate text-white">
              <span className="sm:block hidden">
                Or, Sign-In with your email
              </span>
              <span className="block sm:hidden">Login with email</span>
            </p>
          </Separator>
        </div>

        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <LinkLockerFormItem
                  disabled={isPending}
                  type="email"
                  placeholder="Enter Your Email"
                  field={field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <LinkLockerFormItem
                  disabled={isPending}
                  type="password"
                  placeholder="******"
                  field={field}
                />
              )}
            />

            <ButtonWithSpinner
              isPending={isPending}
              title="Login to Link Locker"
            />
          </form>
        </Form>
        <div className="flex justify-end">
          <Button
            variant={"link"}
            asChild
            className="w-fit"
            disabled={isPending}
          >
            <Link
              href={LinkLockerSignUpPage}
              className={cn(
                "underline  underline-offset-4 block",
                isPending && "pointer-events-none opacity-65"
              )}
            >
              Sign-Up
            </Link>
          </Button>

          <ResetPasswordForm isPending={isPending} />
        </div>
      </div>
    </>
  );
};

export default SignInForm;
