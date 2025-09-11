import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import { inngest } from '@/config/inngest';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ 
                success: false, 
                message: 'No signature found' 
            }, { status: 400 });
        }

        // ✅ Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json({ 
                success: false, 
                message: `Webhook Error: ${err.message}` 
            }, { status: 400 });
        }

        await connectDB();

        // ✅ Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const { orderId, userId } = paymentIntent.metadata;

                // ✅ Update order status to paid
                const order = await Order.findByIdAndUpdate(
                    orderId,
                    {
                        paymentStatus: 'PAID',
                        stripePaymentIntentId: paymentIntent.id,
                        status: 'Order Placed'
                    },
                    { new: true }
                );

                if (order) {
                    // ✅ Send success event to Inngest
                    await inngest.send({
                        name: "order/payment-completed",
                        data: {
                            orderId: orderId,
                            userId: userId,
                            paymentIntentId: paymentIntent.id,
                            amount: order.amount,
                            items: order.items,
                            address: order.address,
                            date: Date.now(),
                        },
                    });
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const { orderId } = paymentIntent.metadata;

                // ✅ Update order status to failed
                await Order.findByIdAndUpdate(
                    orderId,
                    {
                        paymentStatus: 'FAILED',
                        stripePaymentIntentId: paymentIntent.id,
                        status: 'Payment Failed'
                    }
                );

                // ✅ Send failed event to Inngest (optional)
                await inngest.send({
                    name: "order/payment-failed",
                    data: {
                        orderId: orderId,
                        paymentIntentId: paymentIntent.id,
                        error: paymentIntent.last_payment_error?.message || 'Payment failed',
                        date: Date.now(),
                    },
                });
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Webhook processed successfully' 
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}