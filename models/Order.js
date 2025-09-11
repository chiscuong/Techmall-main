import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: 'user'},
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
        quantity: {type: Number, required: true},
        selectedColor: {
            name: {type: String},
            value: {type: String}
        }
    }],
    amount: {type: Number, required: true},
    address: {type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true},
    
    // ✅ Thêm payment fields
    paymentMethod: {
        type: String, 
        enum: ['COD', 'ONLINE'], 
        required: true,
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        required: true,
        default: 'PENDING'
    },
    
    // ✅ Stripe specific fields
    stripePaymentIntentId: {type: String}, // Lưu payment intent ID
    stripeSessionId: {type: String}, // Lưu checkout session ID (nếu dùng checkout)
    
    status: {type: String, required: true, default: 'Order Placed'},
    date: {type: Date, default: Date.now}
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;