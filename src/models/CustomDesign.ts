import mongoose, { Schema, Document } from "mongoose";

export interface ICustomDesign extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variantId: string;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  fee: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const customDesignSchema = new Schema<ICustomDesign>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: [500, "Prompt cannot exceed 500 characters"],
    },
    originalImageUrl: {
      type: String,
      required: true,
    },
    generatedImageUrl: {
      type: String,
    },
    fee: {
      type: Number,
      required: true,
      min: [0, "Fee cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

customDesignSchema.index({ user: 1, createdAt: -1 });
customDesignSchema.index({ user: 1, product: 1 });

const CustomDesign = mongoose.model<ICustomDesign>(
  "CustomDesign",
  customDesignSchema,
);

export default CustomDesign;
