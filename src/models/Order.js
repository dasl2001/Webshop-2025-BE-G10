import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  total: { type: Number, required: true },

  //Koppling till användare som gjort beställningen
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
