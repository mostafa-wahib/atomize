import { object, string, TypeOf } from "zod";
export const createUserSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(7, "Password needs to be mininum 7 characters long"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Email is invalid"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.confirmPasswords"
>;
