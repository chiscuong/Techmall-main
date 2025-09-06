import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
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

    // Tính tổng tiền
let amount = 0;
const processedItems = [];

for (const item of items) {
  const productId = item.productId || item.product; // Support both formats
  const product = await Product.findById(productId);
  if (!product) throw new Error(`Product ${productId} not found`);
  
  amount += product.offerPrice * item.quantity;
  
  // Chuẩn hóa item format cho Inngest
  processedItems.push({
    product: productId,
    quantity: item.quantity,
    selectedColor: item.selectedColor || null
  });
}
    // làm rỗng cart khi tạo order
    



    // Gửi event tới Inngest (không lưu trực tiếp vào DB)
    await inngest.send({
  name: "order/created",
  data: {
    userId,
    address,
    items: processedItems, // Dùng processedItems thay vì items
    amount: amount + Math.floor(amount * 0.02),
    date: Date.now(),
  },
});

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
