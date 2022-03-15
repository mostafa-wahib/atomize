import zod from "zod";
import mongoose from "mongoose";

export interface UrlDocument {
  short: string;
  original: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

const UrlSchema = new mongoose.Schema<UrlDocument>({
  short: { type: String, required: true, unique: true },
  original: { type: String, required: true },
  createdBy: { type: String, default: null },
});

const model = mongoose.model("UrlModel", UrlSchema);

export default model;
