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

    // Mock data để test
    return NextResponse.json({ 
      success: true, 
      user: {
        _id: userId,
        name: "Test User",
        email: "test@example.com",
        cartItems: {}
      }
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}