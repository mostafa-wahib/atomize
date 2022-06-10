import mongoose, { DocumentDefinition } from "mongoose";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 6);
export interface UrlDocument extends mongoose.Document {
  short: string;
  original: string;
  referrers: Map<string, number>;
  custom: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: string;
}

export type UrlData =
  | Pick<UrlDocument, "original" | "custom">
  | Partial<Omit<DocumentDefinition<UrlDocument>, "createdAt" | "updatedAt">>;
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
const UrlSchema = new mongoose.Schema<UrlDocument>({
  short: { type: String, unique: true, default: () => nanoid() },
  original: { type: String, required: true },
  referrers: { type: Map, of: Number, defualt: {} },
  custom: { type: Boolean, default: false },
  createdBy: { type: String, default: null },
});
UrlSchema.pre("save", async function (next: any) {
  const url = this;
  let short = url.short;
  //loop until unused shortid is found
  while (true) {
    let urlDoc = await model.findOne({ short });
    if (!urlDoc) break;
    if (urlDoc.custom) next(new ConflictError("Short id already exists"));
    short = nanoid();
  }
  url.short = short;
  next();
});
const model = mongoose.model("UrlModel", UrlSchema);
export default model;
