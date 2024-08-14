import { z } from "zod";

export const UrlSchema = z
  .string()
  .url({ message: "Please paste the valid url" });
