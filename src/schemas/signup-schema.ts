"use client";

import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().min(2).max(50),
  password: z
    .string()
    .min(4, { message: "Min password length 4 Character" })
    .max(8, { message: "Max Password length 8 Character" }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
