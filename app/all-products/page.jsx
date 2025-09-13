"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard"; // Component hiển thị sản phẩm
import Link from "next/link";
import Navbar from "@/components/Navbar";
const AllProducts = () => {
  const searchParams = useSearchParams();
  const { products } = useAppContext(); // Giả sử products được lấy từ context
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const categories = [
    { value: "All" },
    { value: "Earphone" },
    { value: "Headphone" },
    { value: "Watch" },
    { value: "Smartphone" },
    { value: "Laptop" },
    { value: "Camera" },
    { value: "Accessories" },
    { value: "Tablet" },
  ];

  useEffect(() => {
    // Lấy category từ URL params
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam || "All");

    // Filter products dựa trên category
    if (!categoryParam || categoryParam === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === categoryParam.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [searchParams, products]);
  // sort products
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const sortData = (data, sortOption) => {
    if (!data || data.length === 0) return data;

    const sortedData = [...data]; // Clone array để không mutate original

    switch (sortOption) {
      case "name-asc":
        return sortedData.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

      case "name-desc":
        return sortedData.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );

      case "price-asc":
        return sortedData.sort(
          (a, b) =>
            (a.offerPrice || a.price || 0) - (b.offerPrice || b.price || 0)
        );

      case "price-desc":
        return sortedData.sort(
          (a, b) =>
            (b.offerPrice || b.price || 0) - (a.offerPrice || a.price || 0)
        );

      default:
        return sortedData; // Trả về theo thứ tự gốc
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };
  // Áp dụng sort lên filtered products
  const sortedProducts = sortData(filteredProducts, sortOption);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory && selectedCategory !== "All"
                ? `${selectedCategory} Products`
                : "All Products"}
            </h1>

            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-gray-700 hover:text-p-500">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      href="/all-products"
                      className="text-gray-700 hover:text-p-500"
                    >
                      All Products
                    </Link>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      href="/aboutus"
                      className="text-gray-700 hover:text-p-500"
                    >
                      Aboutus
                    </Link>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      href="/contact"
                      className="text-gray-700 hover:text-p-500"
                    >
                      Contact
                    </Link>
                  </div>
                </li>
                {selectedCategory && selectedCategory !== "All" && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-gray-500">{selectedCategory}</span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Category Filter */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                        selectedCategory === cat.value
                          ? "bg-p-500 text-white"
                          : "hover:bg-p-100 text-gray-700"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.value}</span>
                      {selectedCategory === cat.value && (
                        <span className="ml-auto text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          {cat.value === "All"
                            ? products.length
                            : filteredProducts.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Products Grid */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {sortedProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                  {selectedCategory && selectedCategory !== "All" && (
                    <span>
                      {" "}
                      in <strong>{selectedCategory}</strong>
                    </span>
                  )}
                </p>

                {/* Sort Options */}
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-p-500"
                >
                  <option value="default">Sort by</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory && selectedCategory !== "All"
                      ? `No products available in ${selectedCategory} category.`
                      : "No products available at the moment."}
                  </p>
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className="bg-p-500 text-white px-6 py-2 rounded-lg hover:bg-p-600 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
