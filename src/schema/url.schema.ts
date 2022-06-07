import { object, string } from "zod";
export const createUrlSchema = object({
  body: object({
    url: string({
      required_error: "original url is required",
    }).url("Url is invalid"),
    short: string().min(3).max(8).optional(),
  }),
});

export const lookupUrlSchema = object({
  params: object({
    short: string().min(3).max(8),
  }),
});
