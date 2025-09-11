import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import { UserProfile } from "@clerk/nextjs";
import Order from "@/models/Order";
import mongoose from "mongoose";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//luu du lieu nguoi dung len database
export const syncUserCreation = inngest.createFunction(
    {
    id:'sync-user-from-clerk'
},
    {
    event:'clerk/user.created'
},
async ({event}) => {
    const {id,first_name,last_name,email_addresses,image_url
 } = event.data
 const userData = {
    _id:id,
    email:email_addresses[0].email_address,
    name: first_name + ' ' + last_name,
    imageUrl:image_url
 }
 await connectDB()
 await User.create(userData)
}
)

// inngest function to update in database
export const syncUserUpdation = inngest.createFunction(
    {
        id:'sync-user-from-clerkv2'
        },
        {
            event:'clerk/user.updated'
        },
        async({event}) => {
             const {id,first_name,last_name,email_addresses,image_url
 } = event.data
 const userData = {
    _id:id,
    email:email_addresses[0].email_address,
    name: first_name + ' ' + last_name,
    imageUrl:image_url
 }
 await connectDB()
 await User.findByIdAndUpdate(id,userData)
        }
    )

//inngest functions to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
    id:'delete-user-with-clerk'
},
{
    event:'clerk/user.deleted'
},
async ({event}) => {
    const {id} = event.data 
    await connectDB()
    await User.findByIdAndDelete(id)
}
)
//

export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    await connectDB();
    console.log("📌 Inngest connected DB:", mongoose.connection.name);

    const orders = events.map((event) => ({
      userId: event.data.userId,
      items: event.data.items,
      amount: event.data.amount,
      address: event.data.address,
      date: event.data.date,
    }));

    console.log("📦 Orders to insert:", orders);

    // Lưu orders
    const savedOrders = await Order.insertMany(orders);
    console.log("✅ Saved orders:", savedOrders.map((o) => o._id));

    // Clear giỏ hàng từng user
    for (const order of orders) {
      try {
        const user = await User.findById(order.userId);
        if (user) {
          console.log(`🧑 Found user: ${user._id} | Cart before:`, user.cartItems);
          user.cartItems = {};
          await user.save();
          console.log(`🛒 Cart cleared for user ${user._id} | After:`, user.cartItems);
        } else {
          console.warn(`⚠️ User ${order.userId} not found in DB`);
        }
      } catch (err) {
        console.error(`❌ Error clearing cart for ${order.userId}:`, err.message);
      }
    }

    return { success: true, processed: orders.length };
  }
);