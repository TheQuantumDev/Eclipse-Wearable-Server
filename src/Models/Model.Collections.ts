// Models/Model.Collections.ts
import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";

const collectionSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => uuidv7(),
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["Gowns", "Tops", "Skirts", "Jumpsuits", "Accessories"],
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr: string[]) {
        return arr.length > 0;
      },
      message: "At least one image is required",
    },
  },
  sizes: {
    type: [String],
    enum: ["S", "M", "L", "XL", "XXL"],
    default: ["M", "L"],
  },
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster lookups
collectionSchema.index({ category: 1, createdAt: -1 });

const Collections = mongoose.model("Collections", collectionSchema);

export default Collections;
