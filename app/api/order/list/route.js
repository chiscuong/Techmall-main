import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Lấy userId từ Clerk authentication
        const { userId } = getAuth(request);

        // Kiểm tra xem user đã đăng nhập chưa
        if (!userId) {
            return NextResponse.json({
                success: false, 
                message: "Unauthorized - User not logged in"
            }, { status: 401 });
        }

        // Kết nối database
        await connectDB();

        // Ensure models are loaded (fix the original syntax error)
        Address.modelName; // This ensures the model is loaded
        Product.modelName; // This ensures the model is loaded

        // Tìm tất cả orders của user và populate dữ liệu liên quan
        const orders = await Order.find({ userId })
            .populate({
                path: 'address',
                select: 'fullName area city state phoneNumber' // Chọn các field cần thiết
            })
            .populate({
                path: 'items.product',
                select: 'name image price offerPrice colors' // Chọn các field cần thiết
            })
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Lọc bỏ các items có product = null và format dữ liệu
        const cleanedOrders = orders.map(order => {
            const orderObj = order.toObject();
            return {
                ...orderObj,
                // Lọc bỏ items có product null hoặc undefined
                items: orderObj.items.filter(item => 
                    item.product !== null && 
                    item.product !== undefined
                )
            };
        });

        // Lọc bỏ các orders không có items hợp lệ (optional)
        const validOrders = cleanedOrders.filter(order => order.items.length > 0);

        return NextResponse.json({
            success: true, 
            orders: validOrders,
            count: validOrders.length
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 });
    }
}