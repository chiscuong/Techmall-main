import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push("/product/" + product._id);
    scrollTo(0, 0);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
    router.push("/product/" + product._id);
    // Handle buy action
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col bg-white rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-p-200 group"
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-p-50 to-p-100 rounded-t-2xl w-full h-48 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-4/5 h-4/5 relative"
        >
          <Image
            src={product.image[0]}
            alt={product.name}
            className="object-contain w-full h-full"
            width={400}
            height={400}
          />
        </motion.div>

        {/* Like Button */}
        <motion.button
          onClick={handleLikeClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
            isLiked
              ? "bg-sc-600 text-white"
              : "bg-white text-p-600 hover:bg-p-50"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
        </motion.button>

        {/* Quick Buy Button - Appears on hover */}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        {/* Product Name */}
        <h3 className="font-semibold text-p-900 text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Description - Hidden on small screens */}
        <p className="text-xs text-p-600 max-sm:hidden line-clamp-2 min-h-[2rem]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-p-800">{4.5}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Image
                  className="h-3 w-3"
                  src={
                    index < Math.floor(4.5)
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star"
                />
              </motion.div>
            ))}
          </div>
          <span className="text-xs text-p-500 ml-1">(128)</span>
        </div>

        {/* Price and Buy Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-p-200">
          <div className="flex flex-col">
            <p className="text-lg md:text-xl font-bold text-p-900">
              {currency}
              {product.offerPrice}
            </p>
            {product.originalPrice &&
              product.originalPrice !== product.offerPrice && (
                <p className="text-sm text-p-500 line-through">
                  {currency}
                  {product.originalPrice}
                </p>
              )}
          </div>

          <motion.button
            onClick={handleBuyClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex px-4 py-2 bg-p-600 text-white rounded-lg text-sm font-medium hover:bg-p-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
