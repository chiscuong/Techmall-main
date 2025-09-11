import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import Order from "@/models/Order";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items, paymentMethod = 'COD', amount: frontendAmount } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // ✅ Tính tổng tiền và validate
    let calculatedAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const productId = item.productId || item.product;
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product ${productId} not found`);
      
      calculatedAmount += product.offerPrice * item.quantity;
      
      processedItems.push({
        product: productId,
        quantity: item.quantity,
        selectedColor: item.selectedColor || null
      });
    }

    // ✅ Add tax (2%)
    const finalAmount = calculatedAmount + Math.floor(calculatedAmount * 0.02);

    // ✅ Validate amount từ frontend
    if (frontendAmount && Math.abs(frontendAmount - finalAmount) > 1) {
      return NextResponse.json({ 
        success: false, 
        message: "Amount mismatch detected" 
      }, { status: 400 });
    }

    if (paymentMethod === 'COD') {
      // ✅ COD: Tạo order ngay với status pending
      await inngest.send({
        name: "order/created",
        data: {
          userId,
          address,
          items: processedItems,
          amount: finalAmount,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          date: Date.now(),
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: "Order placed successfully!" 
      });

    } else if (paymentMethod === 'ONLINE') {
      // ✅ ONLINE: Tạo order với status pending, chờ payment
      const newOrder = new Order({
        userId,
        items: processedItems,
        amount: finalAmount,
        address,
        paymentMethod: 'ONLINE',
        paymentStatus: 'PENDING',
        status: 'Awaiting Payment'
      });

      const savedOrder = await newOrder.save();

      return NextResponse.json({
        success: true,
        message: "Order created, proceed to payment",
        orderId: savedOrder._id,
        amount: finalAmount
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid payment method" 
    }, { status: 400 });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}