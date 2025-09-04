"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        console.log("📩 Messages fetched:", data);
        setMessages(data);
      } catch (error) {
        console.error("❌ Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p className="p-6">Loading messages...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Messages</h1>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border border-p-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">{msg.subject}</h2>
              <p className="text-gray-600">{msg.message}</p>
              <div className="mt-2 text-sm text-gray-500">
                From: {msg.name} ({msg.email})
              </div>
              <div className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
