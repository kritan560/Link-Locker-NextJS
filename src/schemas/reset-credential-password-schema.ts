import { z } from "zod";

export const resetCredentialPasswordSchema = z
  .object({
    Password: z
      .string()
      .refine(
        (value) => /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/.test(value ?? ""),
        "Name should contain alphabet and number"
      ),

    ConfirmPassword: z
      .string()
      .refine(
        (value) => /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/.test(value ?? ""),
        "Name should contain alphabet and number"
      ),
  })
  .refine(
    ({ Password, ConfirmPassword }) => {
      if (Password == ConfirmPassword) {
        return true;
      }
      return false;
    },
    {
      message: "Password & confirm password did not match",
      path: ["ConfirmPassword"],
    }
  );

export type ResetCredentialPasswordSchemaType = z.infer<
  typeof resetCredentialPasswordSchema
>;
