"use client";

import { UrlSchema } from "@/schemas/url-schema";
import { SaveLinkServer } from "@/servers/save-link-server";
import { Url } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { startTransition } from "react";
import toast from "react-hot-toast";
import { LinkLockerToastJSX } from "./toast/link-locker-toast";

type ClipboardContextProps = {
  children: React.ReactNode;
  addOptimisticUrls?: (action: Url) => void;
};

const ClipboardContext = (props: ClipboardContextProps) => {
  const { children, addOptimisticUrls = () => {} } = props;

  const pathname = usePathname();
  const router = useRouter();

  const handleReadClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // vaildating the clipboard text to be url
      const { success, data, error } = UrlSchema.safeParse(text);

      if (success) {
        // TODO : make optimistic update
        startTransition(() => {
          // you have used addOptimistic url from useOptimistic useOptimistic is a React Hook that lets you show a different state while an async action is underway. which means you need to have async action underway here SaveLinkServer is async action that is underway.
          addOptimisticUrls({
            blur: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: crypto.randomUUID(),
            userId: crypto.randomUUID(),
            url: data,
          });
        });

        toast.custom((t) => <LinkLockerToastJSX t={t} toastMessage={data} />);

        const { message, success } = await SaveLinkServer({
          clipboardData: data,
          pathname,
        });

        if (success) {
          router.refresh();

          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} />
          ));
        }

        if (!success) {
          toast.custom((t) => (
            <LinkLockerToastJSX t={t} toastMessage={message} error />
          ));
        }
      }

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
