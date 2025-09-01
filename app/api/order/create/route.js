import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found`);
      amount += product.offerPrice * item.quantity;
    }

    // Save order to Techmall DB
    const newOrder = new Order({
      userId,
      items: items.map(item => ({ product: item.product, quantity: item.quantity })),
      amount: amount + Math.floor(amount * 0.02), // add 2% tax
      address,
      status: "Order Placed",
      date: Date.now()
    });
    await newOrder.save();

    // Send Inngest event
    await inngest.send({
      name: "order/created",
      data: { userId, address, items, amount: newOrder.amount, date: newOrder.date }
    });

    // Clear user cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed", orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
