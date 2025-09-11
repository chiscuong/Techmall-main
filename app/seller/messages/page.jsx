"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  CheckCircle,
  Trash2,
  Reply,
  User,
  Clock,
  Search,
  Filter,
  MailOpen,
  AlertCircle,
  Eye,
  ChevronDown,
} from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !msg.isRead) ||
      (filter === "read" && msg.isRead);

    const matchesSearch =
      searchTerm === "" ||
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getMessageStats = () => {
    return {
      total: messages.length,
      unread: messages.filter((msg) => !msg.isRead).length,
      read: messages.filter((msg) => msg.isRead).length,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-p-50 via-white to-p-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-p-200 border-t-p-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-p-600 text-lg">Loading messages...</p>
        </div>
      </div>
    );
  }

  const stats = getMessageStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-p-50 via-white to-p-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-p-700 via-p-800 to-p-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center justify-between"
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Customer Messages
              </h1>
              <p className="text-p-100 text-lg max-w-2xl">
                Manage and respond to customer inquiries efficiently
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-p-200 text-sm">Total Messages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.unread}
                </div>
                <div className="text-p-200 text-sm">Unread</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.read}
                </div>
                <div className="text-p-200 text-sm">Read</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 pb-12">
        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-p-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-p-600 font-semibold mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-p-800">{stats.total}</p>
              </div>
              <div className="p-4 bg-p-100 rounded-2xl">
                <Mail size={32} className="text-p-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-p-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold mb-1">
                  Unread Messages
                </p>
                <p className="text-3xl font-bold text-orange-700">
                  {stats.unread}
                </p>
              </div>
              <div className="p-4 bg-orange-100 rounded-2xl">
                <AlertCircle size={32} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-p-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold mb-1">
                  Read Messages
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {stats.read}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl">
                <CheckCircle size={32} className="text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-p-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-p-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search messages, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-p-50 rounded-xl p-2">
              {[
                { key: "all", label: "All", count: stats.total },
                { key: "unread", label: "Unread", count: stats.unread },
                { key: "read", label: "Read", count: stats.read },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filter === key
                      ? "bg-p-600 text-white shadow-lg"
                      : "text-p-600 hover:bg-p-100"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl border border-p-200 p-16 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-p-100 rounded-full flex items-center justify-center">
                  <MessageSquare size={48} className="text-p-600" />
                </div>
                <h3 className="text-2xl font-bold text-p-800 mb-4">
                  {searchTerm || filter !== "all"
                    ? "No messages found"
                    : "No messages yet"}
                </h3>
                <p className="text-p-600 mb-8 max-w-md mx-auto">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Customer messages will appear here when they contact you through your website."}
                </p>
              </motion.div>
            ) : (
              filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    !msg.isRead
                      ? "border-orange-200 bg-gradient-to-r from-orange-50 to-white"
                      : "border-p-200"
                  }`}
                >
                  <div className="p-8">
                    <div className="flex flex-col xl:flex-row gap-8">
                      {/* Message Header & Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-2xl ${
                                !msg.isRead ? "bg-orange-100" : "bg-p-100"
                              }`}
                            >
                              {!msg.isRead ? (
                                <MailOpen
                                  size={24}
                                  className="text-orange-600"
                                />
                              ) : (
                                <Mail size={24} className="text-p-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-p-800">
                                  {msg.subject || "No Subject"}
                                </h2>
                                {!msg.isRead && (
                                  <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                                    NEW
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-6 text-sm text-p-600 mb-4">
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  <span className="font-semibold text-p-700">
                                    {msg.name || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail size={16} />
                                  <span>{msg.email || "No email"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  <span>
                                    {msg.createdAt
                                      ? new Date(msg.createdAt).toLocaleString()
                                      : "No date"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-p-25 border-l-4 border-p-500 rounded-r-xl p-6 mb-6">
                          <p className="text-p-700 leading-relaxed whitespace-pre-wrap">
                            {msg.message || "No message content"}
                          </p>
                        </div>
                      </div>

                      {/* Actions Sidebar */}
                      <div className="xl:w-64 space-y-4">
                        <h4 className="font-bold text-p-800 mb-4">Actions</h4>

                        <div className="space-y-3">
                          {!msg.isRead && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAsRead(msg._id)}
                              className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200"
                            >
                              <CheckCircle size={20} />
                              Mark as Read
                            </motion.button>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-p-600 hover:bg-p-700 text-white rounded-xl font-semibold transition-all duration-200"
                          >
                            <Reply size={20} />
                            Reply
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200"
                          >
                            <Eye size={20} />
                            View Details
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteMessage(msg._id)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200"
                          >
                            <Trash2 size={20} />
                            Delete
                          </motion.button>
                        </div>

                        {/* Message Priority/Status */}
                        <div className="pt-4 border-t border-p-200">
                          <div className="space-y-2">
                            <div
                              className={`px-3 py-2 rounded-lg text-center font-semibold ${
                                !msg.isRead
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {!msg.isRead ? "🔴 Unread" : "✅ Read"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
