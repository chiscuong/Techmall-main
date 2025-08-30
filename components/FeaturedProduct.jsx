import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.fearture1,
    title: "Iphone 16 Series",
    description: "Full iPhone 16 overview with all the new features!",
  },
  {
    id: 2,
    image: assets.fearture2,
    title: "Macbook pro 16 inch",
    description: "Here You Will Find The Best High quality MacBook Pro",
  },
  {
    id: 3,
    image: assets.fearture3,
    title: "Power in Every Pixel",
    description: "Shop the latest tablet for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-16 md:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-p-50 to-white">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-p-900 mb-4">
          Featured Products
        </h2>
        <p className="text-lg text-p-600 mb-6 max-w-2xl mx-auto">
          Discover our handpicked selection of premium products
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-p-500 to-p-700 mx-auto rounded-full"></div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto"
      >
        {products.map(({ id, image, title, description }) => (
          <motion.div
            key={id}
            variants={cardVariants}
            className="relative group cursor-pointer"
          >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
              {/* Image */}
              <div className="relative h-80 md:h-96 overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  width={600}
                  height={800}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-p-950/90 via-p-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              </div>

              {/* Content Overlay */}
              <motion.div
                initial={{ y: 20, opacity: 0.8 }}
                whileHover={{ y: -10, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
              >
                <motion.h3
                  className="font-bold text-xl md:text-2xl lg:text-3xl mb-3 leading-tight"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {title}
                </motion.h3>

                <motion.p
                  className="text-sm md:text-base text-p-100 mb-6 leading-relaxed max-w-sm"
                  initial={{ y: 10, opacity: 0.8 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {description}
                </motion.p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="group/btn flex items-center gap-2 bg-gradient-to-r from-sc-400 to-sc-600 text-neu-900 px-6 py-3 rounded-xl font-semibold text-sm md:text-base hover:bg-p-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Explore Now
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform duration-300"
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Decorative Corner Element */}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center mt-16"
      >
        <p className="text-p-600 mb-6 text-lg">
          Ready to explore our full collection?
        </p>
        <button className="px-8 py-4 bg-p-700 text-white rounded-xl font-semibold text-lg hover:bg-p-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <a href="/all-products">View All Products</a>
        </button>
      </motion.div>
    </div>
  );
};

export default FeaturedProduct;
