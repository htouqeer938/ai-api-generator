import mongoose, { Schema, model, models, type Model } from "mongoose";
import type { GenerationResult, DatabaseType, Framework } from "@/types";

export interface GenerationDoc {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  database: DatabaseType;
  framework: Framework;
  input: string;
  result: GenerationResult;
  createdAt: Date;
  updatedAt: Date;
}

const GenerationSchema = new Schema<GenerationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    database: { type: String, required: true },
    framework: { type: String, required: true },
    input: { type: String, required: true },
    // The full structured generation result (files, endpoints, analysis, …).
    result: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// Most-recent first, scoped per user.
GenerationSchema.index({ userId: 1, createdAt: -1 });

export const Generation: Model<GenerationDoc> =
  (models.Generation as Model<GenerationDoc>) ||
  model<GenerationDoc>("Generation", GenerationSchema);
