import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_FACTOR: number = 10;
export interface UserDocument extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  comparePasswords(canditatePassword: string): Promise<boolean>;
}
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this as UserDocument;
  if (!user.isModified) return next();
  const salt: string = await bcrypt.genSalt(SALT_FACTOR);
  const hash: string = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

UserSchema.methods.comparePasswords = async function (
  canditatePassword: string
): Promise<boolean> {
  try {
    const user = this as UserDocument;
    return bcrypt.compare(canditatePassword, user.password);
  } catch (e) {
    return false;
  }
};
const model = mongoose.model("UserModel", UserSchema);
export default model;
