// File: app/api/product/delete/[id]/route.js

import connectDB from "@/config/db";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Connect to database
connectDB();

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // Product ID from URL parameter
    
    // Try to get userId from Clerk auth first
    let userId;
    try {
      const authResult = auth();
      userId = authResult?.userId;
      console.log("🔍 Clerk server auth userId:", userId);
    } catch (authError) {
      console.log("🔍 Clerk server auth failed:", authError.message);
    }
    
    // Fallback: get userId from request body
    if (!userId) {
      try {
        const body = await request.json();
        userId = body?.userId;
        console.log("🔍 Using fallback userId from request body:", userId);
      } catch (bodyError) {
        console.log("🔍 Failed to parse request body");
      }
    }
    
    if (!userId) {
      console.log("🔍 No userId found from any method");
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized - No user ID found" 
      }, { status: 401 });
    }

    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: "Product not found" 
      }, { status: 404 });
    }

    console.log("🔍 Product belongs to userId:", product.userId);
    console.log("🔍 Current request userId:", userId);

    // Check if the product belongs to the current user
    if (product.userId !== userId) {
      return NextResponse.json({ 
        success: false, 
        message: "Not authorized to delete this product" 
      }, { status: 403 });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    console.log("✅ Product deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Delete product error:", error);

    return NextResponse.json({
      success: false,
      message: "Server error occurred while deleting product"
    }, { status: 500 });
  }
}