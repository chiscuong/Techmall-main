"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CreditCard, Lock, ArrowLeft, CheckCircle } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { getToken, currency } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Tạo Payment Intent
      const token = await getToken();
      const { data } = await axios.post(
        "/api/stripe/create-payment-intent",
        {
          amount,
          orderId,
          currency: "usd",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      // ✅ Confirm payment với Stripe
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setPaymentStatus("failed");
      } else if (paymentIntent.status === "succeeded") {
        // ✅ Payment thành công
        await updateOrderStatus(paymentIntent.id);
        setPaymentStatus("succeeded");
        toast.success("Payment successful!");

        setTimeout(() => {
          router.push("/order-placed");
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
      setPaymentStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (paymentIntentId) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/stripe/update-order",
        {
          orderId,
          paymentIntentId,
          status: "paid",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  if (paymentStatus === "succeeded") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600">Redirecting to order confirmation...</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <CardElement options={cardElementOptions} />
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          isLoading || !stripe
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
        } text-white`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Processing Payment...
          </div>
        ) : (
          <>
            <Lock size={20} />
            Pay {currency}
            {amount}
          </>
        )}
      </motion.button>

      {paymentStatus === "failed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-red-600 mb-4">Payment failed. Please try again.</p>
          <button
            type="button"
            onClick={() => setPaymentStatus("pending")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retry Payment
          </button>
        </motion.div>
      )}
    </form>
  );
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    } else {
      toast.error("Order ID not found");
      router.push("/cart");
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      // Fetch order data để lấy amount
      // Bạn cần tạo API này: /api/order/[orderId]/route.js
      const { data } = await axios.get(`/api/order/${orderId}`);
      if (data.success) {
        setOrderData(data.order);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load order data");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </button>

          <CreditCard size={48} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            Order Total:{" "}
            <span className="font-semibold">${orderData?.amount}</span>
          </p>
        </div>

        {/* Payment Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm orderId={orderId} amount={orderData?.amount} />
        </Elements>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock size={16} />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
