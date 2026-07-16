import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
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
    maxlength: 500,
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

collectionSchema.index({ category: 1, createdAt: -1 });

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
