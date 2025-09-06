import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  // Limit products to show only 2 rows
  // For responsive grid: mobile (2 cols) = 4 products, tablet (3 cols) = 6 products, desktop (4 cols) = 8 products, xl (5 cols) = 10 products
  const getMaxProducts = () => {
    // You can adjust these numbers based on your preference
    if (window.innerWidth >= 1280) return 10; // xl: 5 cols x 2 rows
    if (window.innerWidth >= 1024) return 8; // lg: 4 cols x 2 rows
    if (window.innerWidth >= 768) return 6; // md: 3 cols x 2 rows
    return 4; // mobile: 2 cols x 2 rows
  };

  // Alternative: Use a fixed number for all screen sizes (simpler approach)
  const MAX_PRODUCTS = 8; // This will show approximately 2 rows on most screens

  const limitedProducts = products.slice(0, MAX_PRODUCTS);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center py-16 md:py-20 px-4 md:px-6 lg:px-8 top-8 w-full max-w-none">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 w-full"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-p-900 mb-4">
          Popular Products
        </h2>
        <p className="text-lg md:text-xl text-p-600 max-w-2xl mx-auto">
          Discover our most loved items, carefully curated for quality and style
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-p-500 to-p-700 mx-auto mt-6 rounded-full"></div>
      </motion.div>

      {/* Products Grid - Limited to 2 rows */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 w-full"
      >
        {limitedProducts.map((product, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* See More Button - Only show if there are more products */}
      {products.length > MAX_PRODUCTS && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <button
            onClick={() => {
              router.push("/all-products");
            }}
            className="group relative px-10 py-4 bg-white border-2 border-p-300 rounded-xl text-p-700 font-semibold text-lg hover:bg-p-600 hover:text-white hover:border-p-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-p-600 to-p-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

            {/* Button content */}
            <span className="relative flex items-center gap-2">
              See All Products ({products.length - MAX_PRODUCTS}+ more)
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </button>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-p-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-p-300/20 rounded-full blur-2xl"></div>
    </div>
  );
};

export default HomeProducts;
