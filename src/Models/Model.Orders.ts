import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  items: [
    {
      collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true,
      },
    },
  ],
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "Nigeria" },
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paystack"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  notes: {
    type: String,
    maxLength: 300,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster order lookups
orderSchema.index({ orderId: 1, status: 1, "customer.email": 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
