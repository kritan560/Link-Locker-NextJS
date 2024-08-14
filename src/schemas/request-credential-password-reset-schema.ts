import { z } from "zod";

export const requestCredentialPasswordResetSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export type RequestCredentialPasswordResetSchemaType = z.infer<
  typeof requestCredentialPasswordResetSchema
>;
