"use server";

import { signOut } from "@/auth";
import { LinkLockerSignInPage } from "@/constants/routes";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect as NextRedirect } from "next/navigation";

/**
 * The server action that will signout the user
 *
 * @param redirect - If set to false, the signOut method will return the URL to redirect to instead of redirecting automatically.
 * @param redirectTo - The relative path to redirect to after signing out. By default, the user is redirected to the current page.
 */
export async function SignOutServers() {
  // when using --turbo dev signOut from next-auth/react package won't work so this server action is build to handle the signout
  try {
    await signOut({ redirect: false });
  } catch (err) {
    if (isRedirectError(err)) {
      console.error(err);
      throw err;
    }
  } finally {
    NextRedirect(LinkLockerSignInPage);
  }
}
