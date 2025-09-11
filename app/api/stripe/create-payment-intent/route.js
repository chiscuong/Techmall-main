import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {auth} from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
       //clerk auth
        const {userId}  = await auth();
        if(!userId){
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const { amount, currency = 'usd', orderId } = await request.json();
        
        // ✅ Tạo Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency,
            metadata:{
                orderId,
                userId,
            }
        })
        
        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
        
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

