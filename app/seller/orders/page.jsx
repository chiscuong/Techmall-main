"use client";
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        return { bg: "#d1f2eb", color: "#0f5132" };
      case "pending":
        return { bg: "#fff3cd", color: "#664d03" };
      case "processing":
      case "shipped":
        return { bg: "#d1ecf1", color: "#0c5460" };
      case "cancelled":
        return { bg: "#f8d7da", color: "#721c24" };
      default:
        return { bg: "#fff3cd", color: "#664d03" };
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return { bg: "#d1f2eb", color: "#0f5132" };
      case "pending":
        return { bg: "#fff3cd", color: "#664d03" };
      case "failed":
        return { bg: "#f8d7da", color: "#721c24" };
      default:
        return { bg: "#fff3cd", color: "#664d03" };
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div
      className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm"
      style={{ backgroundColor: "#f9fafb" }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className=" flex justify-center md:p-10 p-4 space-y-6">
          <div className="max-w-4xl space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="bg-white rounded-lg shadow-sm p-6 border transition-all duration-200 hover:shadow-md"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    {/* Product Info */}
                    <div className="flex-1 flex gap-4 max-w-80">
                      <div
                        className="p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "#f5f7f9" }}
                      >
                        <Image
                          className="w-12 h-12 object-cover"
                          src={assets.box_icon}
                          alt="box_icon"
                          width={48}
                          height={48}
                        />
                      </div>

                      <div className="flex flex-col gap-2 min-w-0">
                        <span
                          className="font-semibold text-sm leading-5"
                          style={{ color: "#101828" }}
                        >
                          {order.items && order.items.length > 0
                            ? order.items
                                .map(
                                  (item) =>
                                    `${item.product?.name || "Product"} x ${
                                      item.quantity || 1
                                    }`
                                )
                                .join(", ")
                            : "No items"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: "#f5eef5",
                              color: "#b87cb4",
                            }}
                          >
                            {order.items?.length || 0}{" "}
                            {(order.items?.length || 0) === 1
                              ? "Item"
                              : "Items"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm mb-2"
                        style={{ color: "#364153" }}
                      >
                        Shipping Address
                      </h4>
                      <div
                        className="text-sm space-y-1"
                        style={{ color: "#6a7282" }}
                      >
                        <p className="font-medium" style={{ color: "#364153" }}>
                          {order.address?.fullName || "N/A"}
                        </p>
                        <p>{order.address?.area || "N/A"}</p>
                        <p>{`${order.address?.city || ""}, ${
                          order.address?.state || ""
                        }`}</p>
                        <p className="font-medium">
                          {order.address?.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-center lg:text-left">
                      <h4
                        className="font-semibold text-sm mb-2"
                        style={{ color: "#364153" }}
                      >
                        Total Amount
                      </h4>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#101828" }}
                      >
                        {currency}
                        {order.amount || 0}
                      </p>
                    </div>

                    {/* Order Details */}
                    <div className="text-center lg:text-left min-w-0">
                      <h4
                        className="font-semibold text-sm mb-3"
                        style={{ color: "#364153" }}
                      >
                        Order Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-center lg:justify-start">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#f5f7f9",
                              color: "#5d7298",
                            }}
                          >
                            COD
                          </span>
                        </div>

                        <p style={{ color: "#6a7282" }}>
                          <span className="font-medium">Date:</span>{" "}
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "N/A"}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-center lg:justify-start">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                              style={getStatusColor(order.status || "pending")}
                            >
                              {order.status || "Pending"}
                            </span>
                          </div>

                          <div className="flex justify-center lg:justify-start">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                              style={getPaymentStatusColor(
                                order.paymentStatus || "pending"
                              )}
                            >
                              {order.paymentStatus || "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div
                    className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    style={{ borderTopColor: "#e5e7eb" }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {/* Quick Status Update Buttons */}
                      {(order.status || "pending").toLowerCase() !==
                        "delivered" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "delivered")
                          }
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                          style={{
                            backgroundColor: "#d1f2eb",
                            color: "#0f5132",
                          }}
                        >
                          ✓ Mark Delivered
                        </button>
                      )}

                      {(order.status || "pending").toLowerCase() !==
                        "processing" &&
                        (order.status || "pending").toLowerCase() !==
                          "delivered" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "processing")
                            }
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                            style={{
                              backgroundColor: "#d1ecf1",
                              color: "#0c5460",
                            }}
                          >
                            📦 Mark Processing
                          </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: "#f5f7f9",
                          color: "#5d7298",
                        }}
                      >
                        View Details
                      </button>

                      <div className="relative">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md appearance-none cursor-pointer pr-8"
                          style={{
                            backgroundColor: "#7b96b6",
                            color: "white",
                            border: "none",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#101828" }}
                >
                  No orders yet
                </h3>
                <p className="mb-6" style={{ color: "#6a7282" }}>
                  When customers place orders, they'll appear here.
                </p>
                <button
                  className="px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                  style={{
                    backgroundColor: "#7b96b6",
                    color: "white",
                  }}
                >
                  View Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
