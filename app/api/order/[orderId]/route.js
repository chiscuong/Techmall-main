import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const { orderId } = params;

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();

        // ✅ Tìm order theo ID và userId để bảo mật
        const order = await Order.findOne({ 
            _id: orderId, 
            userId: userId 
        }).populate('items.product', 'name image offerPrice')
          .populate('address');

        if (!order) {
            return NextResponse.json({ 
                success: false, 
                message: 'Order not found' 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                _id: order._id,
                amount: order.amount,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                stripePaymentIntentId: order.stripePaymentIntentId,
                items: order.items,
                address: order.address,
                date: order.date
            }
        });

    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}