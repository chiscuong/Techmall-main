import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Volume2, Zap } from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative my-16 mx-4 md:mx-8 lg:mx-16">
      {/* Main Banner Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-p-100 via-p-200 to-p-300 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] md:min-h-[500px]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-p-600 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-p-700 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-p-500 rounded-full blur-xl"></div>
        </div>

        {/* Left Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 p-8 lg:p-12"
        >
          <div className="relative">
            <Image
              className="w-48 md:w-56 lg:w-64 drop-shadow-2xl"
              src={assets.jbl_soundbox_image}
              alt="JBL Soundbox"
            />
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-sc-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              NEW
            </div>
          </div>
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center text-center px-6 lg:px-8 z-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neu-900 mb-4 leading-tight max-w-md">
            Level Up Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-sc-700 to-sc-500">
              Gaming Experience
            </span>
          </h2>

          <p className="text-lg md:text-xl text-neu-700 mb-8 max-w-md leading-relaxed">
            From immersive sound to precise controls—everything you need to
            dominate the game
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Volume2, text: "Premium Audio" },
              { icon: Zap, text: "Lightning Fast" },
              { icon: Gamepad2, text: "Pro Gaming" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
              >
                <Icon size={16} className="text-neu-600" />
                <span className="text-sm font-medium text-neu-800">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sc-500 to-sc-600 hover:from-sc-600 hover:to-sc-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Shop Now
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </motion.button>
        </motion.div>

        {/* Right Product Image */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative z-10 p-8 lg:p-12"
        >
          <div className="relative">
            {/* Desktop Controller */}
            <Image
              className="hidden lg:block w-64 xl:w-80 drop-shadow-2xl"
              src={assets.md_controller_image}
              alt="Gaming Controller"
            />
            {/* Mobile Controller */}
            <Image
              className="lg:hidden w-48 md:w-56 drop-shadow-2xl"
              src={assets.sm_controller_image}
              alt="Gaming Controller"
            />

            {/* Floating price tag */}
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-8 right-8 w-16 h-16 bg-orange-500/20 rounded-full blur-xl"
        ></motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-12 left-12 w-12 h-12 bg-p-600/30 rounded-full blur-lg"
        ></motion.div>
      </motion.div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex justify-center gap-8 md:gap-12 mt-8"
      >
        {[
          { number: "50K+", label: "Happy Gamers" },
          { number: "99%", label: "Satisfaction Rate" },
          { number: "24/7", label: "Support" },
        ].map(({ number, label }) => (
          <div key={label} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-p-800">
              {number}
            </div>
            <div className="text-sm text-p-600">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Banner;
