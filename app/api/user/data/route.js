import connectDB from "@/config/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("📌 [API START] /api/user/data called");

    const { userId } = await auth();
    console.log("👉 userId:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    console.log("🔍 CartItems from DB:", user.cartItems);

    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems || {}
      }
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}