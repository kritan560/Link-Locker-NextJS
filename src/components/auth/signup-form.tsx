"use client";

import { Form, FormField } from "@/components/ui/form";
import { LinkLockerHomepage, LinkLockerSignInPage } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SignUpSchema, SignUpSchemaType } from "@/schemas/signup-schema";
import { SignUpServer } from "@/servers/signup-server";
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
import { LinkLockerToastJSX } from "../toast/link-locker-toast";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const SignUpForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: SignUpSchemaType) {
    startTransition(async () => {
      const { data, message, success } = await SignUpServer(values);

      if (success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} />
        ));

        // redirecting user to the homepage after user is created
        if (message === "Please check your email to verify your account") {
          router.push(LinkLockerHomepage);
          nProgress.start();
        }
      } else if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX t={t} toastMessage={message} error={!success} />
        ));

        // redirecting user to the homepage when user already exist
        if (message === "User Already Exist in Server redirecting you to signin page") {
          router.push(LinkLockerHomepage);
          nProgress.start();
        }
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
            <p className="hidden sm:block">Create Account With Google</p>
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
            <p className="md:hidden sm:block hidden">
              Create Account With Github
            </p>
          </Button>
        </div>

        <div className="py-5">
          <Separator className="relative h-[2px] bg-gray-800 w-full mx-auto">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md text-white bg-gray-800 px-2 dark:bg-inherit truncate">
              <span className="sm:block hidden">
                Or, Create Account with your email
              </span>
              <span className="block sm:hidden">Register with email</span>
            </p>
          </Separator>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <LinkLockerFormItem
                  disabled={isPending}
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
                  placeholder="******"
                  type="password"
                  field={field}
                />
              )}
            />

            <ButtonWithSpinner
              title="Create Account to Link Locker"
              isPending={isPending}
            />
          </form>
        </Form>

        <div className="flex justify-end">
          <Button
            variant={"link"}
            asChild
            className="flex justify-end"
            disabled={isPending}
          >
            <Link
              href={LinkLockerSignInPage}
              className={cn(
                "underline  underline-offset-4 block",
                isPending && "pointer-events-none opacity-65"
              )}
            >
              Sign-In
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
