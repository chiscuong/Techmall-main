import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("📌 [API] /api/user/create called");

    const { userId } = await auth();
    console.log("👉 userId:", userId);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🔍 Request body:", body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findById(userId);
    if (existingUser) {
      console.log("✅ User already exists");
      return NextResponse.json({ success: true, user: existingUser });
    }

    // Create name from multiple sources
    let userName = body.name || 
                   body.fullName || 
                   `${body.firstName || ''} ${body.lastName || ''}`.trim() || 
                   'Anonymous User';

    // Handle imageUrl - allow empty string
    let userImage = body.image || body.imageUrl || '';

    console.log("🔍 Processed user data:", {
      userId,
      userName,
      userImage,
      email: body.email
    });

    // Create new user
    const newUser = new User({
      _id: userId,
      name: userName,
      email: body.email || 'no-email@example.com',
      imageUrl: userImage, // This should be optional in your schema
    });

    await newUser.save();
    console.log("✅ New user created:", newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("❌ Create user error:", error);
    console.error("❌ Error details:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}