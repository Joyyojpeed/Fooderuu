import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Object,
  paid: {type: Boolean, default: false},
  razorpayPaymentId: String,
  razorpayOrderId: String,
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);