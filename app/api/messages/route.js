import connectDB from "@/config/db";
import Message from "@/models/Message";

// GET all messages
export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST new message
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newMessage = new Message(body);
    await newMessage.save();
    return new Response(JSON.stringify({ success: true, message: newMessage }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
