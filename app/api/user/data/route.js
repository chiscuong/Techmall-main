import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId, sessionId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Tìm user trong DB
    let user = await User.findById(userId);

    // Nếu chưa có thì tạo mới
    if (!user) {
      // Gọi Clerk API để lấy thông tin user
      const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user from Clerk");
      }

      const clerkUser = await res.json();

      user = new User({
        _id: clerkUser.id,
        name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim(),
        email: clerkUser.email_addresses[0]?.email_address,
        imageUrl: clerkUser.image_url,
      });

      await user.save();
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User data error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
