"use client";
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update order status function (local only - không call API)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order marked as ${newStatus}`);
  };

  // Status color functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return {
          bg: "bg-green-100",
          color: "text-green-800",
          icon: CheckCircle,
        };
      case "pending":
        return { bg: "bg-yellow-100", color: "text-yellow-800", icon: Clock };
      case "processing":
      case "shipped":
        return { bg: "bg-blue-100", color: "text-blue-800", icon: Truck };
      case "cancelled":
        return { bg: "bg-red-100", color: "text-red-800", icon: XCircle };
      default:
        return { bg: "bg-yellow-100", color: "text-yellow-800", icon: Clock };
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return { bg: "bg-green-100", color: "text-green-800" };
      case "pending":
        return { bg: "bg-yellow-100", color: "text-yellow-800" };
      case "failed":
        return { bg: "bg-red-100", color: "text-red-800" };
      default:
        return { bg: "bg-yellow-100", color: "text-yellow-800" };
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status?.toLowerCase() === filterStatus;
    const matchesSearch =
      order.items?.some((item) =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && (searchTerm === "" || matchesSearch);
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status?.toLowerCase() === "pending")
        .length,
      processing: orders.filter((o) => o.status?.toLowerCase() === "processing")
        .length,
      delivered: orders.filter((o) => o.status?.toLowerCase() === "delivered")
        .length,
    };
    return stats;
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const stats = getOrderStats();

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
                Order Management
              </h1>
              <p className="text-p-100 text-lg max-w-2xl">
                Track and manage all your customer orders in one place
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-p-200 text-sm">Total Orders</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.pending}
                </div>
                <div className="text-p-200 text-sm">Pending</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.processing}
                </div>
                <div className="text-p-200 text-sm">Processing</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.delivered}
                </div>
                <div className="text-p-200 text-sm">Delivered</div>
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
        {/* Filters & Search */}
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
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border-2 border-p-200 rounded-xl px-4 py-3 pr-10 outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 font-medium"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-p-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const statusInfo = getStatusColor(order.status || "pending");
                const paymentInfo = getPaymentStatusColor(
                  order.paymentStatus || "pending"
                );
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={order._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-xl border border-p-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-8">
                      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Product Info */}
                        <div className="xl:col-span-1">
                          <div className="flex items-start gap-4">
                            <div className="p-4 bg-p-50 rounded-2xl flex-shrink-0">
                              <Package size={32} className="text-p-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-p-800 mb-2 leading-tight">
                                {order.items && order.items.length > 0
                                  ? order.items
                                      .map(
                                        (item) =>
                                          `${item.product?.name || "Product"}`
                                      )
                                      .join(", ")
                                  : "No items"}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {order.items?.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-p-100 text-p-700 rounded-full text-sm font-medium"
                                  >
                                    Qty: {item.quantity || 1}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="xl:col-span-1">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                              <MapPin size={24} className="text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-800 mb-3">
                                Shipping To
                              </h4>
                              <div className="space-y-1 text-gray-600">
                                <p className="font-semibold text-gray-800">
                                  {order.address?.fullName || "N/A"}
                                </p>
                                <p className="text-sm">
                                  {order.address?.area || "N/A"}
                                </p>
                                <p className="text-sm">
                                  {`${order.address?.city || ""}, ${
                                    order.address?.state || ""
                                  }`}
                                </p>
                                <p className="font-semibold text-sm">
                                  📱 {order.address?.phoneNumber || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="xl:col-span-1">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                              <DollarSign
                                size={24}
                                className="text-green-600"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-800 mb-3">
                                Order Details
                              </h4>
                              <div className="space-y-3">
                                <div className="text-2xl font-bold text-green-600">
                                  {currency}
                                  {order.amount || 0}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar size={16} />
                                  {order.date
                                    ? new Date(order.date).toLocaleDateString()
                                    : "N/A"}
                                </div>

                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                  💰 COD
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="xl:col-span-1">
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-800">
                              Status & Actions
                            </h4>

                            {/* Status Badges */}
                            <div className="space-y-2">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${statusInfo.bg} ${statusInfo.color} font-semibold`}
                              >
                                <StatusIcon size={16} />
                                <span className="capitalize">
                                  {order.status || "Pending"}
                                </span>
                              </div>

                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full ${paymentInfo.bg} ${paymentInfo.color} text-sm font-medium ml-2`}
                              >
                                Payment: {order.paymentStatus || "Pending"}
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2">
                              {(order.status || "pending").toLowerCase() !==
                                "delivered" && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    updateOrderStatus(order._id, "delivered")
                                  }
                                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                >
                                  <CheckCircle size={16} />
                                  Delivered
                                </motion.button>
                              )}

                              {(order.status || "pending").toLowerCase() !==
                                "processing" &&
                                (order.status || "pending").toLowerCase() !==
                                  "delivered" && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateOrderStatus(order._id, "processing")
                                    }
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                  >
                                    <Truck size={16} />
                                    Process
                                  </motion.button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="bg-gray-50 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          <Eye size={16} />
                          View Details
                        </motion.button>
                      </div>

                      <div className="relative">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="appearance-none bg-p-600 hover:bg-p-700 text-white px-4 py-2 pr-8 rounded-lg font-medium cursor-pointer transition-all duration-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl border border-p-200 p-16 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-p-100 rounded-full flex items-center justify-center">
                  <Package size={48} className="text-p-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "No orders found"
                    : "No orders yet"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "When customers place orders, they'll appear here. Start by adding some products to your store."}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-p-600 to-p-700 text-white rounded-xl font-semibold hover:from-p-700 hover:to-p-800 transition-all duration-200"
                  >
                    Add Products
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
