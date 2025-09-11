import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import { inngest } from '@/config/inngest';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, newStatus } = await request.json();

        console.log('User ID:', userId); // Debug log

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        if (!orderId || !newStatus) {
            return NextResponse.json({ 
                success: false, 
                message: 'Order ID and status are required' 
            }, { status: 400 });
        }

        // ✅ Valid status options
        const validStatuses = [
            'pending', 
            'processing', 
            'shipped', 
            'delivered', 
            'cancelled'
        ];

        if (!validStatuses.includes(newStatus.toLowerCase())) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid status' 
            }, { status: 400 });
        }

        await connectDB();

        // ✅ Find order first
        const order = await Order.findById(orderId)
            .populate('items.product', 'sellerId name');

        if (!order) {
            return NextResponse.json({ 
                success: false, 
                message: 'Order not found' 
            }, { status: 404 });
        }

        console.log('Order found:', order._id); // Debug log
        console.log('Order items:', order.items.map(item => ({
            product: item.product?._id,
            sellerId: item.product?.sellerId
        })));

        // ✅ Check if user is the seller of any product in this order
         

        // ✅ Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                ...(newStatus === 'delivered' && { 
                    paymentStatus: 'PAID' // Auto mark as paid when delivered for COD
                })
            },
            { new: true }
        ).populate('items.product', 'name image')
          .populate('address');

        // ✅ Send event to Inngest for notifications, emails, etc.
        try {
            await inngest.send({
                name: "order/status-updated",
                data: {
                    orderId: orderId,
                    userId: order.userId,
                    sellerId: userId,
                    oldStatus: order.status,
                    newStatus: newStatus,
                    orderData: {
                        amount: order.amount,
                        items: order.items,
                        paymentMethod: order.paymentMethod
                    },
                    date: Date.now(),
                },
            });
        } catch (inngestError) {
            console.error('Inngest error:', inngestError);
            // Don't fail the request if Inngest fails
        }

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${newStatus}`,
            order: updatedOrder
        });

    } catch (error) {
        console.error('Update order status error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}