import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();

    // Check nếu user đã tồn tại
    let user = await User.findById(userId);
    if (!user) {
      const body = await request.json();
      user = await User.create({
        _id: userId,
        name: body.name,
        email: body.email,
        imageUrl: body.imageUrl,
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
