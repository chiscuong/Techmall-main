"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const markAsRead = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const deleteMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.isRead;
    if (filter === "read") return msg.isRead;
    return true;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-4 animate-spin mx-auto mb-4"
            style={{
              borderColor: "#e5e7eb",
              borderTopColor: "#7b96b6",
            }}
          ></div>
          <p style={{ color: "#6a7282" }}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#101828" }}>
            Customer Messages
          </h1>
          <p style={{ color: "#6a7282" }}>
            Manage and respond to customer inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-lg shadow-sm p-6 border"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#6a7282" }}>
                  Total Messages
                </p>
                <p className="text-2xl font-bold" style={{ color: "#101828" }}>
                  {messages.length}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#f5f7f9" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "#7b96b6" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-6 border"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#6a7282" }}>
                  Unread Messages
                </p>
                <p className="text-2xl font-bold" style={{ color: "#101828" }}>
                  {messages.filter((msg) => !msg.isRead).length}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#fff3cd" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "#664d03" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-6 border"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#6a7282" }}>
                  Read Messages
                </p>
                <p className="text-2xl font-bold" style={{ color: "#101828" }}>
                  {messages.filter((msg) => msg.isRead).length}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#d1f2eb" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "#0f5132" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div
            className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border"
            style={{ borderColor: "#e5e7eb" }}
          >
            {["all", "unread", "read"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                  filter === filterType ? "shadow-sm" : ""
                }`}
                style={{
                  backgroundColor:
                    filter === filterType ? "#7b96b6" : "transparent",
                  color: filter === filterType ? "white" : "#6a7282",
                }}
              >
                {filterType} (
                {filterType === "all"
                  ? messages.length
                  : filterType === "unread"
                  ? messages.filter((msg) => !msg.isRead).length
                  : messages.filter((msg) => msg.isRead).length}
                )
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#101828" }}
            >
              {filter === "all" ? "No messages yet" : `No ${filter} messages`}
            </h3>
            <p style={{ color: "#6a7282" }}>
              {filter === "all"
                ? "Customer messages will appear here when they contact you."
                : `No ${filter} messages found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
                  !msg.isRead ? "ring-2 ring-opacity-20" : ""
                }`}
                style={{
                  borderColor: "#e5e7eb",
                  ...(!msg.isRead && {
                    ringColor: "#7b96b6",
                    borderLeftColor: "#7b96b6",
                    borderLeftWidth: "4px",
                  }),
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2
                        className="font-semibold text-lg"
                        style={{ color: "#101828" }}
                      >
                        {msg.subject || "No Subject"}
                      </h2>
                      {!msg.isRead && (
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: "#fff3cd",
                            color: "#664d03",
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>

                    <div
                      className="flex items-center gap-4 text-sm mb-3"
                      style={{ color: "#6a7282" }}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span
                          className="font-medium"
                          style={{ color: "#364153" }}
                        >
                          {msg.name || "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{msg.email || "No email"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString()
                            : "No date"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    {!msg.isRead && (
                      <button
                        onClick={() => markAsRead(msg._id)}
                        className="p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
                        style={{
                          backgroundColor: "#d1f2eb",
                          color: "#0f5132",
                        }}
                        title="Mark as read"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                      }}
                      title="Delete message"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div
                  className="p-4 rounded-lg mb-4"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderLeft: "3px solid #7b96b6",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: "#364153" }}
                  >
                    {msg.message || "No message content"}
                  </p>
                </div>

                {/* Reply Button */}
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: "#7b96b6",
                      color: "white",
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
