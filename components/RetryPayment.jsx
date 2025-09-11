import { motion } from "framer-motion";
import { CreditCard, AlertCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const RetryPayment = ({ order }) => {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push(`/checkout/payment?orderId=${order._id}`);
  };

  if (order.paymentMethod !== "ONLINE" || order.paymentStatus === "PAID") {
    return null; // Không hiển thị nếu không phải online payment hoặc đã thanh toán
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 my-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle size={24} className="text-red-600" />
        <h3 className="text-lg font-semibold text-red-800">Payment Required</h3>
      </div>

      <div className="mb-4">
        <p className="text-red-700 text-sm mb-2">
          Your order is pending payment. Complete your payment to process the
          order.
        </p>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Order ID:</strong> #{order._id}
          </p>
          <p>
            <strong>Amount:</strong> ${order.amount}
          </p>
          <p>
            <strong>Status:</strong> {order.paymentStatus}
          </p>
        </div>
      </div>

      <motion.button
        onClick={handleRetryPayment}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <CreditCard size={20} />
        Complete Payment Now
        <RotateCcw size={16} />
      </motion.button>

      <p className="text-xs text-center text-gray-500 mt-3">
        🔒 Your payment is secure and encrypted
      </p>
    </motion.div>
  );
};

export default RetryPayment;
