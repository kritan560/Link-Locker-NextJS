import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).nullable(),
  email: z.string().email({ message: "Please Enter valid email" }).nullable(),
});
export type ProfileUpdateSchemaType = z.infer<typeof ProfileUpdateSchema>;
