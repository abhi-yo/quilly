import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust if your auth options are elsewhere
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db"; // Import DB connector
import { Payment } from "@/models/Payment"; // Import Payment model
import mongoose from 'mongoose'; // Import mongoose

// Ensure environment variables are loaded and non-null
const keyId = process.env.RZP_KEYID;
const keySecret = process.env.RZP_KEYSECRET;

if (!keyId || !keySecret) {
  console.error("Razorpay API keys are not defined in environment variables.");
  // Optionally throw an error during startup if keys are critical
}

const razorpay = new Razorpay({
  key_id: keyId!,
  key_secret: keySecret!,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) { // Check for user ID from session
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const amount = 1000;
    const currency = "INR";
    const receiptId = `receipt_order_${crypto.randomBytes(8).toString("hex")}`;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receiptId,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }

    // --- Save initial payment record to DB ---
    await connectToDatabase();
    const newPayment = new Payment({
      userId: new mongoose.Types.ObjectId(session.user.id), // Use user ID from session
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      receiptId: order.receipt,
    });
    await newPayment.save();
    console.log("Initial Payment record saved to DB:", newPayment);
    // --- End save --- 

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      // Optionally return internal payment ID if needed on frontend
      // internalPaymentId: newPayment._id 
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to create payment order", details: errorMessage },
      { status: 500 }
    );
  }
} 