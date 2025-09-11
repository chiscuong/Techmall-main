import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import { inngest } from '@/config/inngest';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, paymentIntentId, status } = await request.json();

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();

        // ✅ Tìm và update order
        const order = await Order.findOne({ 
            _id: orderId, 
            userId: userId 
        });

        if (!order) {
            return NextResponse.json({ 
                success: false, 
                message: 'Order not found' 
            }, { status: 404 });
        }

        // ✅ Update order với payment info
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: status === 'paid' ? 'PAID' : 'FAILED',
                stripePaymentIntentId: paymentIntentId,
                status: status === 'paid' ? 'Order Placed' : 'Payment Failed',
                ...(status === 'paid' && { date: new Date() }) // Update date khi payment thành công
            },
            { new: true }
        );

        // ✅ Nếu payment thành công, gửi event tới Inngest để xử lý order
        if (status === 'paid') {
            await inngest.send({
                name: "order/payment-completed",
                data: {
                    orderId: orderId,
                    userId: userId,
                    paymentIntentId: paymentIntentId,
                    amount: order.amount,
                    items: order.items,
                    address: order.address,
                    date: Date.now(),
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: status === 'paid' ? 'Payment completed successfully' : 'Payment failed',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}