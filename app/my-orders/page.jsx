"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, CreditCard, Truck } from "lucide-react";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 md:px-16 lg:px-32 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">
              Track and manage your recent purchases
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loading />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500">
                Start shopping to see your orders here!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-p-50 to-p-100 px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-p-600 rounded-lg">
                          <Package size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order._id?.slice(-6) || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <p className="text-xl font-bold text-p-700">
                          {currency}
                          {order.amount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Products Section */}
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Package size={18} />
                          Items ({order.items.length})
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                            >
                              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                {item.product?.image?.[0] ? (
                                  <Image
                                    src={item.product.image[0]}
                                    alt={item.product?.name || "Product"}
                                    className="w-full h-full object-cover"
                                    width={64}
                                    height={64}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Package
                                      size={24}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {item.product?.name || "[Product not found]"}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </span>
                                  {item.selectedColor && (
                                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-gray-200">
                                      <div
                                        className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
                                        style={{
                                          backgroundColor:
                                            item.selectedColor.value,
                                        }}
                                      ></div>
                                      <span className="text-sm font-medium text-gray-700">
                                        {item.selectedColor.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  {currency}
                                  {item.product?.offerPrice || 0}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details Section */}
                      <div className="space-y-6">
                        {/* Delivery Address */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin size={18} />
                            Delivery Address
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="font-medium text-gray-900">
                              {order.address?.fullName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {order.address?.area}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.address?.city}, {order.address?.state}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              📞 {order.address?.phoneNumber}
                            </p>
                          </div>
                        </div>

                        {/* Payment & Shipping */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard size={18} />
                            Payment & Shipping
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                Payment Method:
                              </span>
                              <span className="font-medium">
                                Cash on Delivery
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                Payment Status:
                              </span>
                              <span className="text-orange-600 font-medium">
                                Pending
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <Truck size={14} />
                                Free Delivery
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
