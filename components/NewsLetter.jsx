import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Gift, ArrowRight } from "lucide-react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="relative py-20 md:py-24 px-4 md:px-8  overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-neu-500 mb-6 leading-tight"
        >
          Subscribe now & get{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sc-300 to-sc-600">
            20% off
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-neu-500 mb-12 max-w-2xl leading-relaxed"
        >
          Join thousands of satisfied customers and be the first to know about
          exclusive deals, new arrivals, and special offers.
        </motion.p>

        {/* Email Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {!isSubmitted ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-xl">
              <div className="relative flex-1 w-full sm:w-auto">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-p-300"
                />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 outline-none text-p-900 placeholder:text-neu-500 font-medium text-lg focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 h-14 bg-gradient-to-r from-sc-400 to-sc-600 text-black rounded-xl font-bold text-lg hover:from-sc-600 hover:to-sc-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center "
              >
                Subscribe
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ✓
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
              <p className="text-p-100">
                Check your email for your 20% discount code
              </p>
            </motion.div>
          )}
        </motion.form>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 text-sm md:text-base text-neu-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full "></div>
            <span>Exclusive Deals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Early Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>No Spam Promise</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsLetter;
