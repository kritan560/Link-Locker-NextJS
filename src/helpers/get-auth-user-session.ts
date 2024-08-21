"use server";

import { auth } from "@/auth";

/**
 *
 */
export async function GetAuthUserSession() {
  try {
    const session = await auth();

    return {
      isUserLoggedIn: !!session,
      username: session?.user.name,
      email: session?.user.email,
      image: session?.user.image,
      id: session?.user.id,
      type: session?.user.type,
    };
  } catch (error) {
    

    return {
      isUserLoggedIn: null,
      username: null,
      email: null,
      image: null,
      id: null,
      type: null,
    };
  }
}
