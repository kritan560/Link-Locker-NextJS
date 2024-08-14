"use client";

import { SaveLinkReturnType } from "@/app/api/save-link/route.reutrntype";
import { env } from "@/env";
import { UrlSchema } from "@/schemas/url-schema";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";

type ClipboardContextProps = {
  children: React.ReactNode;
};

const ClipboardContext = (props: ClipboardContextProps) => {
  const { children } = props;

  const router = useRouter();
  const pathname = usePathname();

  const handleReadClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // vaildating the clipboard text to be url
      const { success, data, error } = UrlSchema.safeParse(text);

      if (success) {
        toast.custom((t) => <LinkLockerToastJSX t={t} toastMessage={text} />);

        // TODO: call API here to save the validated data. the user needs to be verified before saving link
        const response = await fetch(`${env.NEXT_PUBLIC_URL}/api/save-link`, {
          method: "POST",
          body: JSON.stringify({ clipboardData: data, pathname }),
        });

        // TODO : make user of optimistic update for saving url into DB.

        const responseJsonData =
          (await response.json()) as Awaited<SaveLinkReturnType>;

        if (responseJsonData.success) {
          if (
            responseJsonData.message === "URL Saved Into Database" ||
            "Private URL Saved Into Database"
          ) {
            router.refresh();
            toast.custom((t) => (
              <LinkLockerToastJSX
                t={t}
                toastMessage={responseJsonData.message}
              />
            ));
          }
        }
        if (!responseJsonData.success) {
          if (
            responseJsonData.message === "Something went wrong!!!" ||
            "User Not Logged In"
          ) {
            toast.custom((t) => (
              <LinkLockerToastJSX
                t={t}
                toastMessage={responseJsonData.message}
                error
              />
            ));
          }
        }
      }

      // if error send the first error message as toast
      if (!success) {
        toast.custom((t) => (
          <LinkLockerToastJSX
            t={t}
            toastMessage={error.errors[0].message}
            error={!!error}
          />
        ));
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };
  return <div onClick={handleReadClipboard}>{children}</div>;
};

export default ClipboardContext;
