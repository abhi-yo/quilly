import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db"; // Import DB connector
import { Payment } from "@/models/Payment"; // Import Payment model
// Potentially import User model if updating user credits/status
// import { User } from "@/models/User";

const keySecret = process.env.RZP_KEYSECRET;

export async function POST(req: Request) {
  console.log("Received verification request");

  if (!keySecret) {
    console.error("Razorpay Key Secret is not configured.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("Verification Request Body:", body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing payment details in verification request");
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // --- Verify Signature --- 
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(sign).digest("hex");
    const isValidSignature = expectedSignature === razorpay_signature;

    if (isValidSignature) {
      console.log("Signature Verified Successfully");
      
      // --- Update Database Record --- 
      await connectToDatabase();
      
      const paymentRecord = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

      if (!paymentRecord) {
        console.error(`Payment record not found for order ID: ${razorpay_order_id}`);
        // Note: This shouldn't normally happen if create-order worked
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (paymentRecord.status === 'paid') {
        console.log(`Payment for order ID: ${razorpay_order_id} already processed.`);
        return NextResponse.json({ verified: true, message: "Payment already verified" });
      }

      // Update payment status and details
      paymentRecord.status = 'paid';
      paymentRecord.razorpayPaymentId = razorpay_payment_id;
      paymentRecord.razorpaySignature = razorpay_signature;
      await paymentRecord.save();
      
      console.log(`Payment record ${paymentRecord._id} updated to paid.`);

      // TODO: Implement logic based on successful payment
      // Example: Grant credits to the user
      // await User.findByIdAndUpdate(paymentRecord.userId, { $inc: { credits: 10 } }); 
      
      return NextResponse.json({ verified: true, message: "Payment verified and recorded successfully" });

    } else {
      console.error("Signature Verification Failed");
      // Optional: Update payment status to 'failed' if needed
      // await Payment.updateOne({ razorpayOrderId: razorpay_order_id }, { $set: { status: 'failed' } });
      return NextResponse.json({ verified: false, error: "Invalid payment signature" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Payment verification failed", details: errorMessage },
      { status: 500 }
    );
  }
} 