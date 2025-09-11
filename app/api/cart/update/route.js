import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({
                success: false, 
                message: "User not authenticated"
            }, { status: 401 });
        }

        const { cartData } = await request.json();
        
        if (!cartData || typeof cartData !== 'object') {
            return NextResponse.json({
                success: false, 
                message: "Invalid cart data"
            }, { status: 400 });
        }

        await connectDB();
        
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                success: false, 
                message: "User not found"
            }, { status: 404 });
        }

        // Validate cartData structure
        const validatedCartData = {};
        for (const [key, value] of Object.entries(cartData)) {
            if (typeof value === 'object' && value.productId && value.quantity) {
                validatedCartData[key] = {
                    productId: value.productId,
                    quantity: Math.max(0, parseInt(value.quantity) || 0),
                    selectedColor: value.selectedColor || null
                };
            }
        }

        user.cartItems = validatedCartData;
        await user.save();

        return NextResponse.json({ 
            success: true, 
            message: "Cart updated successfully" 
        });

    } catch (error) {
        console.error("Cart update error:", error);
        return NextResponse.json({
            success: false, 
            message: "Failed to update cart"
        }, { status: 500 });
    }
}