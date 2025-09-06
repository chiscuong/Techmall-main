import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        await connectDB()

        Address.length
        Product.length

        const orders = await Order.find({userId})
.populate('address')
.populate({
  path: 'items.product',
  select: 'name image price offerPrice colors'
})

// Filter out items with null products
const cleanedOrders = orders.map(order => ({
  ...order.toObject(),
  items: order.items.filter(item => item.product !== null)
}))

return NextResponse.json({success:true, orders: cleanedOrders})

        return NextResponse.json({success:true,orders})

    } catch (error) {
        return NextResponse.json({success:false ,message:error.message})
    }
    
}