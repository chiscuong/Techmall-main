import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, currency } = useAppContext();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, "M"); // Default size, adjust as needed
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-300 group overflow-hidden">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-p-500 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>

          {/* Sale Badge (if applicable) */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </div>
          )}

          {/* Quick Add to Cart Button */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-p-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-p-600 transition-colors shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-p-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-p-600">
              {currency}
              {product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {currency}
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating (if available) */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
