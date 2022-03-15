import { object, string } from "zod";
export const createUrlSchema = object({
  body: object({
    original: string({
      required_error: "original url is required",
    }).url("Url is invalid"),
    createdBy: string().optional(),
  }),
});
