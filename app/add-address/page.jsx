"use client";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Building,
  Navigation,
  Save,
  ArrowLeft,
} from "lucide-react";

const AddAddress = () => {
  const { getToken, router } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      name: "fullName",
      placeholder: "Full Name",
      icon: User,
      type: "text",
    },
    {
      name: "phoneNumber",
      placeholder: "Phone Number",
      icon: Phone,
      type: "tel",
    },
    {
      name: "pincode",
      placeholder: "PIN Code",
      icon: Navigation,
      type: "text",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-p-50 via-white to-sc-50">
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-neu-600 hover:text-p-600 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-p-100 rounded-2xl">
                <MapPin size={32} className="text-p-600" />
              </div>
              <h1 className="text-4xl font-bold text-neu-900">
                Add Shipping <span className="text-p-600">Address</span>
              </h1>
            </div>
            <p className="text-neu-600 text-lg max-w-2xl mx-auto">
              Please provide your shipping details to complete your order
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-p-200 overflow-hidden">
                <div className="bg-gradient-to-r from-p-600 to-p-700 p-8 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Shipping Information
                  </h2>
                  <p className="text-p-100">
                    Fill in your delivery details below
                  </p>
                </div>

                <form onSubmit={onSubmitHandler} className="p-8 space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inputFields.map((field) => {
                      const IconComponent = field.icon;
                      return (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="relative group"
                        >
                          <label className="block text-sm font-medium text-neu-700 mb-2">
                            {field.placeholder}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <IconComponent
                                size={20}
                                className="text-neu-400 group-focus-within:text-p-600 transition-colors"
                              />
                            </div>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={address[field.name]}
                              onChange={(e) =>
                                setAddress({
                                  ...address,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-100 transition-all duration-300 text-neu-700 placeholder-neu-400"
                              required
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Address Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                  >
                    <label className="block text-sm font-medium text-neu-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <Home
                          size={20}
                          className="text-neu-400 group-focus-within:text-p-600 transition-colors"
                        />
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Enter your complete address (Area, Street, Landmarks)"
                        value={address.area}
                        onChange={(e) =>
                          setAddress({ ...address, area: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-100 transition-all duration-300 text-neu-700 placeholder-neu-400 resize-none"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* City & State */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="relative group">
                      <label className="block text-sm font-medium text-neu-700 mb-2">
                        City/District
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building
                            size={20}
                            className="text-neu-400 group-focus-within:text-p-600 transition-colors"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="City/District/Town"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-100 transition-all duration-300 text-neu-700 placeholder-neu-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-neu-700 mb-2">
                        State
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin
                            size={20}
                            className="text-neu-400 group-focus-within:text-p-600 transition-colors"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="State"
                          value={address.state}
                          onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-100 transition-all duration-300 text-neu-700 placeholder-neu-400"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isLoading
                        ? "bg-neu-400 cursor-not-allowed text-neu-200"
                        : "bg-gradient-to-r from-p-600 to-p-700 hover:from-p-700 hover:to-p-800 shadow-lg hover:shadow-xl text-white"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Saving Address...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Shipping Address
                      </>
                    )}
                  </motion.button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-sm text-neu-500 pt-4">
                    <div className="w-4 h-4 bg-sc-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Your information is secure and encrypted</span>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Illustration Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 max-w-md mx-auto lg:mx-0"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-p-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-neu-900 mb-2">
                    Fast & Secure Delivery
                  </h3>
                  <p className="text-neu-600">
                    We'll deliver your order safely to your doorstep
                  </p>
                </div>

                {/* Benefits List */}
                <div className="mt-8 space-y-4">
                  {[
                    "Free shipping on orders over $50",
                    "Real-time order tracking",
                    "Secure contactless delivery",
                    "Easy returns & exchanges",
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-sc-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-neu-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddAddress;
