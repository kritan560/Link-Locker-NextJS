import { Url } from "@prisma/client";

export type LinkTableReturnUrlType = Pick<
  Url,
  "blur" | "createdAt" | "updatedAt" | "url" 
>[];