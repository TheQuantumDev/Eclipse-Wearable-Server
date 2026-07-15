import mongoose, { Document } from "mongoose";

interface CollectionsScheme extends Document {
  itemImage: string;
  itemName: string;
  itemPrice: number;
  itemDescription: string;
  itemSize?: string | number;
}

const collectionsSchema = new mongoose.Schema<CollectionsScheme>({
  itemImage: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  itemSize: {
    type: String || Number
  }
});

const Collections = mongoose.model("Collections", collectionsSchema);

export default Collections;
