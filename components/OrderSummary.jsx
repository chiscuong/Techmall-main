import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Tag,
  ChevronDown,
  Plus,
  Receipt,
  Truck,
  Calculator,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
  } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(error.message);
      }
    } catch (error) {}
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handlePromoApply = () => {
    if (promoCode.trim()) {
      setIsPromoApplied(true);
      toast.success("Promo code applied successfully!");
    }
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      setIsLoading(true);
      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key],
      }));

      cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);
      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty");
      }
      const token = await getToken();

      const { data } = await axios.post(
        "/api/order/create",
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const discount = isPromoApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + tax - discount;

  return (
    <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl border border-p-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-p-700 to-p-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Receipt size={24} />
          <h2 className="text-xl md:text-2xl font-bold">Order Summary</h2>
        </div>
        <p className="text-p-100 text-sm">Review your order details</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Address Selection */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-p-800 mb-3">
            <MapPin size={18} />
            Delivery Address
          </label>
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-4 bg-p-50 border-2 border-p-200 rounded-xl hover:border-p-400 focus:border-p-600 focus:outline-none transition-all duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex justify-between items-center">
                <span className="text-p-700 font-medium">
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                    : "Select Address"}
                </span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-p-600" />
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full bg-white border-2 border-p-200 rounded-xl shadow-xl mt-2 z-20 py-2 max-h-60 overflow-y-auto"
                >
                  {userAddresses.map((address, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ backgroundColor: "#f5f7f9" }}
                      className="px-4 py-3 cursor-pointer border-b border-p-100 last:border-b-0"
                      onClick={() => handleAddressSelect(address)}
                    >
                      <p className="font-medium text-p-800">
                        {address.fullName}
                      </p>
                      <p className="text-sm text-p-600">
                        {address.area}, {address.city}, {address.state}
                      </p>
                    </motion.li>
                  ))}
                  <motion.li
                    whileHover={{ backgroundColor: "#f5f7f9" }}
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-3 cursor-pointer text-center text-p-700 font-medium flex items-center justify-center gap-2 hover:text-p-800 transition-colors"
                  >
                    <Plus size={16} />
                    Add New Address
                  </motion.li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-p-800 mb-3">
            <Tag size={18} />
            Promo Code
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 transition-colors duration-300 text-p-700"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePromoApply}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isPromoApplied
                  ? "bg-green-500 text-white"
                  : "bg-p-600 text-white hover:bg-p-700"
              }`}
            >
              {isPromoApplied ? "✓" : "Apply"}
            </motion.button>
          </div>
          {isPromoApplied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              🎉 Promo code applied! You saved 10%
            </motion.div>
          )}
        </div>

        <hr className="border-p-200" />

        {/* Order Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-base">
            <div className="flex items-center gap-2 text-p-600">
              <Receipt size={16} />
              <span>Items ({getCartCount()})</span>
            </div>
            <p className="font-medium text-p-800">
              {currency}
              {subtotal}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-p-600">
              <Truck size={16} />
              <span>Shipping Fee</span>
            </div>
            <p className="font-medium text-green-600">Free</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-p-600">
              <Calculator size={16} />
              <span>Tax (2%)</span>
            </div>
            <p className="font-medium text-p-800">
              {currency}
              {tax}
            </p>
          </div>

          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2 text-green-600">
                <Tag size={16} />
                <span>Discount (10%)</span>
              </div>
              <p className="font-medium text-green-600">
                -{currency}
                {discount}
              </p>
            </motion.div>
          )}

          <div className="flex justify-between items-center text-lg md:text-xl font-bold border-t-2 border-p-200 pt-4 text-p-900">
            <p>Total</p>
            <p>
              {currency}
              {total}
            </p>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="p-6 pt-0">
        <motion.button
          onClick={createOrder}
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-p-400 cursor-not-allowed"
              : "bg-gradient-to-r from-p-700 to-p-800 hover:from-p-800 hover:to-p-900 shadow-lg hover:shadow-xl"
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <>
              <CreditCard size={20} />
              Place Order
            </>
          )}
        </motion.button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-p-600">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Secure checkout guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
