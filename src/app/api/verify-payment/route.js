import { Order } from "src/models/Order";
import mongoose from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import crypto from "crypto";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ✅ Correct signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Invalid signature. Expected:", expectedSignature, "Received:", razorpay_signature);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, userEmail },
      {
        paid: true,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true, orderId: order._id });

  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
