"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { MoveLeft } from "lucide-react";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-sc-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} Items
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((cartKey) => {
                  const cartItem = cartItems[cartKey];
                  const product = products.find(
                    (product) => product._id === cartItem.productId
                  );

                  if (!product || cartItem.quantity <= 0) return null;

                  return (
                    <tr key={cartKey}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(cartKey, 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          {cartItem.selectedColor && (
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: cartItem.selectedColor.value,
                                }}
                              ></div>
                              <span className="text-xs text-gray-600">
                                {cartItem.selectedColor.name}
                              </span>
                            </div>
                          )}
                          <button
                            className="text-xs rounded-lg bg-sc-200 text-sc-600 mt-1 shadow-md"
                            onClick={() => updateCartQuantity(cartKey, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${product.offerPrice}
                      </td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(cartKey, cartItem.quantity - 1)
                            }
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input
                            onChange={(e) =>
                              updateCartQuantity(
                                cartKey,
                                Number(e.target.value)
                              )
                            }
                            type="number"
                            value={cartItem.quantity}
                            className="w-8 border text-center appearance-none"
                          />
                          <button
                            onClick={() =>
                              updateCartQuantity(cartKey, cartItem.quantity + 1)
                            }
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${(product.offerPrice * cartItem.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-sc-600"
          >
            <MoveLeft size={18} />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
