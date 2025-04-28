import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "src/models/MenuItems";
import { Order } from "src/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const {cartProducts, address} = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({error: "Not authenticated"}, {status: 401});
    }

    // Calculate total amount in INR
    let totalAmount = 0;
    for (const product of cartProducts) {
      const menuItem = await MenuItem.findById(product._id);
      if (!menuItem) continue;

      let price = menuItem.basePrice;

      if (product.size) {
        const size = menuItem.sizes.find(s => s._id.toString() === product.size._id.toString());
        if (size) price += size.price;
      }

      if (product.extras?.length > 0) {
        for (const extra of product.extras) {
          const extraInfo = menuItem.extraIngredientPrices.find(e => e._id.toString() === extra._id.toString());
          if (extraInfo) price += extraInfo.price;
        }
      }

      totalAmount += price;
    }

    // Add delivery fee (₹50)
    totalAmount += 50;
    const amountInPaise = Math.round(totalAmount * 100);

    // Create order in database
    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts,
      paid: false,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderDoc._id.toString(),
      notes: {
        orderId: orderDoc._id.toString(),
        userEmail
      }
    });

    // Update our order with Razorpay ID
    await Order.findByIdAndUpdate(orderDoc._id, {
      razorpayOrderId: razorpayOrder.id
    });

    return Response.json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      dbOrderId: orderDoc._id.toString()
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({error: error.message}, {status: 500});
  }
}