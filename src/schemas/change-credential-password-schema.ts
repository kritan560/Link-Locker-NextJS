import { z } from "zod";

export const ChangeCredentailPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(4, { message: "password must be 4 character long" })
      .max(8, { message: "8 is the max charater " }),
    newPassword: z
      .string()
      .min(4, { message: "password must be 4 character long" })
      .max(8, { message: "8 is the max charater " })
      .refine(
        (value) => /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/.test(value ?? ""),
        "Name should contain alpabet and number"
      ),
  })
  .refine(
    ({ newPassword, oldPassword }) => {
      if (newPassword !== oldPassword) {
        return true;
      } else {
        return false;
      }
    },
    { message: "Old and New password can't be same", path: ["newPassword"] }
  );

export type ChangeCredentailPasswordSchemaType = z.infer<
  typeof ChangeCredentailPasswordSchema
>;
