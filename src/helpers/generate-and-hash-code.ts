"use server";

import { hash } from "bcryptjs";

/**
 * This server code will return 6 digit code with it's hash equivalent object.
 * @returns
 */
export async function GenerateAndHashCode() {
  // generating and hashing the new verification code
  const unique6digitCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  const hashedUnique6DigitCode = await hash(unique6digitCode.toString(), 10);

  return { unique6digitCode, hashedUnique6DigitCode };
}
