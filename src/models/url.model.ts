import mongoose, { DocumentDefinition } from "mongoose";
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
  short: { type: String, unique: true },
  original: { type: String, required: true },
  referrers: { type: Map, of: Number, defualt: {} },
  custom: { type: Boolean, default: false },
  createdBy: { type: String, default: null },
});
const model = mongoose.model("UrlModel", UrlSchema);
export default model;
