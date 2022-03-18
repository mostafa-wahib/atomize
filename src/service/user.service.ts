import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import User, { UserDocument } from "../models/user.model";

export async function createUser(
  input: Omit<
    DocumentDefinition<UserDocument>,
    "createdAt" | "updatedAt" | "comparePasswords"
  >
) {
  try {
    return await User.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validateUser(
  email: string,
  password: string
): Promise<Omit<UserDocument, "password"> | null> {
  const user: UserDocument | null = await User.findOne({ email });
  if (!user) return null;
  const match: boolean = await user.comparePasswords(password);
  if (!match) return null;
  return omit(user, "password");
}
