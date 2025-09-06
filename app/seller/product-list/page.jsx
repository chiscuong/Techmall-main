"use client";
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const { user: clerkUser } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which product is being deleted

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete product function - Send userId from Clerk
  const deleteProduct = async (productId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    if (!clerkUser?.id) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    try {
      setDeleteLoading(productId);

      console.log("Sending delete request with userId:", clerkUser.id);

      // Send userId in request body as fallback for server auth
      const { data } = await axios.delete(`/api/product/delete/${productId}`, {
        data: { userId: clerkUser.id },
      });

      if (data.success) {
        toast.success("Xóa sản phẩm thành công!");
        // Remove the deleted product from the local state
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // Debug Clerk user
  useEffect(() => {
    console.log("🔍 Clerk user:", clerkUser);
    console.log("🔍 Clerk user ID:", clerkUser?.id);
    console.log("🔍 Is signed in:", !!clerkUser);
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  return (
    <div
      className="flex-1 min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "#f9fafb" }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium" style={{ color: "#101828" }}>
            All Products
          </h2>

          <div
            className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-lg bg-white shadow-sm"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <table className="table-fixed w-full overflow-hidden">
              <thead
                className="text-sm text-left border-b"
                style={{
                  backgroundColor: "#f5f7f9",
                  borderBottomColor: "#e5e7eb",
                }}
              >
                <tr>
                  <th
                    className="w-2/3 md:w-2/5 px-4 py-4 font-semibold truncate"
                    style={{ color: "#101828" }}
                  >
                    Product
                  </th>
                  <th
                    className="px-4 py-4 font-semibold truncate max-sm:hidden"
                    style={{ color: "#101828" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-4 py-4 font-semibold truncate"
                    style={{ color: "#101828" }}
                  >
                    Price
                  </th>
                  <th
                    className="px-4 py-4 font-semibold truncate"
                    style={{ color: "#101828" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="border-t transition-colors duration-200 hover:bg-opacity-50"
                    style={{
                      borderTopColor: "#e5e7eb",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f7f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-4 flex items-center space-x-3 truncate">
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: "#f5f7f9" }}
                      >
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16 rounded-md"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span
                        className="truncate w-full font-medium"
                        style={{ color: "#364153" }}
                      >
                        {product.name}
                      </span>
                    </td>

                    <td
                      className="px-4 py-4 max-sm:hidden"
                      style={{ color: "#6a7282" }}
                    >
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "#f5eef5",
                          color: "#b87cb4",
                        }}
                      >
                        {product.category}
                      </span>
                    </td>

                    <td
                      className="px-4 py-4 font-semibold"
                      style={{ color: "#101828" }}
                    >
                      ${product.offerPrice}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {/* Visit Button */}
                        <button
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium text-sm"
                          style={{
                            backgroundColor: "#7b96b6",
                            color: "white",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#6b83a8";
                            e.target.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#7b96b6";
                            e.target.style.transform = "translateY(0)";
                          }}
                        >
                          <span className="hidden md:block">Visit</span>
                          <Image
                            className="h-3.5 filter brightness-0 invert"
                            src={assets.redirect_icon}
                            alt="redirect_icon"
                          />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteProduct(product._id)}
                          disabled={deleteLoading === product._id}
                          className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                          }}
                          onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.backgroundColor = "#b91c1c";
                              e.target.style.transform = "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.backgroundColor = "#dc2626";
                              e.target.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          {deleteLoading === product._id ? (
                            <span className="animate-spin">⟳</span>
                          ) : (
                            <>
                              <span className="hidden md:block">Delete</span>
                              <span className="text-sm">🗑️</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-16 w-full">
                <div className="text-6xl mb-4">📦</div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#101828" }}
                >
                  No products found
                </h3>
                <p className="mb-4" style={{ color: "#6a7282" }}>
                  You haven't added any products yet. Start by creating your
                  first product.
                </p>
                <button
                  onClick={() => router.push("/seller/add-product")}
                  className="px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium"
                  style={{
                    backgroundColor: "#7b96b6",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#6b83a8";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#7b96b6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
