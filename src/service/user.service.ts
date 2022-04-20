import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../models/user.model";

export async function getUser(query: FilterQuery<UserDocument>) {
  return await User.findOne(query).lean();
}
export async function createUser(
  input: Omit<
    DocumentDefinition<UserDocument>,
    "createdAt" | "updatedAt" | "comparePasswords"
  >
) {
  try {
    // console.log("user input: ", input);
    return await User.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validateUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const match: boolean = await user.comparePasswords(password);
  if (!match) return null;
  return omit(user.toJSON(), "password");
}
