import { env } from "@/env";

const IS_SERVER = typeof window === "undefined";

/**
 * returns the base URL if in client mode or if in server set the base URL at .env with NEXT_PUBLIC_URL="your public site URL"
 * @returns string
 */
export function GetBaseURL() {
  const baseURL = IS_SERVER ? env.NEXT_PUBLIC_URL! : window.location.origin;
  return baseURL;
}
