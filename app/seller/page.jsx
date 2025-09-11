"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  FileText,
  Plus,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [customColor, setCustomColor] = useState("");

  const predefinedColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Orange", value: "#F97316" },
  ];

  const categories = [
    { value: "Earphone" },
    { value: "Headphone" },
    { value: "Watch" },
    { value: "Smartphone" },
    { value: "Laptop" },
    { value: "Camera" },
    { value: "Accessories" },
    { value: "Tablet" },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = [...files];

      droppedFiles.forEach((file, index) => {
        if (updatedFiles.length < 4) {
          updatedFiles.push(file);
        }
      });

      setFiles(updatedFiles.slice(0, 4));
    }
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) => {
      const exists = prev.find((c) => c.value === color.value);
      if (exists) {
        return prev.filter((c) => c.value !== color.value);
      } else {
        return [...prev, color];
      }
    });
  };

  const addCustomColor = () => {
    if (customColor && !selectedColors.find((c) => c.value === customColor)) {
      const newColor = {
        name: `Custom ${customColor}`,
        value: customColor,
      };
      setSelectedColors((prev) => [...prev, newColor]);
      setCustomColor("");
    }
  };

  const removeColor = (colorValue) => {
    setSelectedColors((prev) => prev.filter((c) => c.value !== colorValue));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("colors", JSON.stringify(selectedColors));

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Earphone");
        setPrice("");
        setOfferPrice("");
        setSelectedColors([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-p-50 via-white to-p-100 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-p-700 via-p-800 to-p-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Add New Product
            </h1>
            <p className="text-p-100 text-lg max-w-2xl mx-auto">
              Create and showcase your amazing products to reach thousands of
              customers
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-p-200 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Left Column - Image Upload (Takes more space) */}
              <div className="xl:col-span-2">
                <div className="mb-8">
                  <label className="block text-2xl font-bold text-p-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-p-100 rounded-xl">
                      <ImageIcon size={24} className="text-p-600" />
                    </div>
                    Product Images
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                      dragActive
                        ? "border-p-600 bg-p-50 scale-[1.02]"
                        : "border-p-300 hover:border-p-500 hover:bg-p-25"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Upload size={64} className="text-p-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-p-700 mb-2">
                        Upload Your Product Images
                      </h3>
                      <p className="text-p-600 mb-2">
                        Drag & drop images here or click to browse
                      </p>
                      <p className="text-sm text-p-500">
                        Maximum 4 images, PNG or JPG format (Max 10MB each)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="relative aspect-square"
                        >
                          <label
                            htmlFor={`image${index}`}
                            className="cursor-pointer block w-full h-full"
                          >
                            <input
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  const updatedFiles = [...files];
                                  updatedFiles[index] = e.target.files[0];
                                  setFiles(updatedFiles);
                                }
                              }}
                              type="file"
                              id={`image${index}`}
                              accept="image/*"
                              className="hidden"
                            />

                            <div
                              className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                files[index]
                                  ? "border-green-400 bg-green-50"
                                  : "border-p-300 hover:border-p-500 hover:bg-p-50"
                              }`}
                            >
                              {files[index] ? (
                                <div className="relative w-full h-full group">
                                  <Image
                                    src={URL.createObjectURL(files[index])}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover rounded-lg"
                                    width={200}
                                    height={200}
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeFile(index);
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={16} />
                                  </motion.button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Plus
                                    size={32}
                                    className="text-p-400 mx-auto mb-2"
                                  />
                                  <p className="text-sm text-p-500 font-medium">
                                    Add Image {index + 1}
                                  </p>
                                </div>
                              )}
                            </div>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Selection Section */}
                <div>
                  <label className="block text-2xl font-bold text-p-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-white"></div>
                    </div>
                    Product Colors
                  </label>

                  <div className="bg-p-25 rounded-2xl p-6 mb-6">
                    <p className="text-p-700 font-semibold mb-4">
                      Choose from predefined colors:
                    </p>
                    <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
                      {predefinedColors.map((color) => (
                        <motion.div
                          key={color.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative cursor-pointer"
                          onClick={() => toggleColor(color)}
                        >
                          <div
                            className={`w-14 h-14 rounded-full border-4 transition-all duration-200 ${
                              selectedColors.find(
                                (c) => c.value === color.value
                              )
                                ? "border-p-600 shadow-lg scale-110"
                                : "border-gray-300 hover:border-p-400"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {selectedColors.find(
                              (c) => c.value === color.value
                            ) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check
                                  size={24}
                                  className="text-white drop-shadow-lg"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <p className="text-gray-700 font-semibold mb-4">
                      Or add a custom color:
                    </p>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-full h-14 rounded-xl border-2 border-gray-200 cursor-pointer"
                        />
                      </div>
                      <motion.button
                        type="button"
                        onClick={addCustomColor}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-4 bg-p-600 text-white rounded-xl hover:bg-p-700 transition-colors font-semibold"
                        disabled={!customColor}
                      >
                        <Plus size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Selected Colors Display */}
                  {selectedColors.length > 0 && (
                    <div>
                      <p className="text-p-700 font-semibold mb-4">
                        Selected colors ({selectedColors.length}):
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {selectedColors.map((color) => (
                          <motion.div
                            key={color.value}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3 bg-white border-2 border-p-200 rounded-full px-4 py-2 shadow-sm"
                          >
                            <div
                              className="w-5 h-5 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color.value }}
                            ></div>
                            <span className="text-p-700 font-medium">
                              {color.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeColor(color.value)}
                              className="text-p-400 hover:text-p-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-p-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-p-100 rounded-xl">
                      <Package size={24} className="text-p-600" />
                    </div>
                    Product Details
                  </h2>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-lg font-semibold text-p-800 mb-3">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full px-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800 text-lg"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-lg font-semibold text-p-800 mb-3">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800 text-lg appearance-none bg-white"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-p-800 mb-3">
                      Original Price
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-p-500"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800 text-lg"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-p-800 mb-3">
                      Offer Price
                    </label>
                    <div className="relative">
                      <Tag
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-p-500"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800 text-lg"
                        onChange={(e) => setOfferPrice(e.target.value)}
                        value={offerPrice}
                        required
                      />
                    </div>
                    {price &&
                      offerPrice &&
                      parseFloat(offerPrice) < parseFloat(price) && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                          <Check size={18} />
                          <span className="font-medium">
                            Discount:{" "}
                            {Math.round(((price - offerPrice) / price) * 100)}%
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-lg font-semibold text-p-800 mb-3">
                    Product Description
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe your product in detail..."
                    className="w-full px-4 py-4 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 resize-none text-p-800 text-lg"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                  <div className="mt-2 text-sm text-p-500 text-right">
                    {description.length}/500 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Warnings */}
            <div className="mt-12">
              <AnimatePresence>
                {(files.length === 0 ||
                  !name ||
                  !description ||
                  !price ||
                  !offerPrice) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 flex items-start gap-4 mb-8"
                  >
                    <AlertCircle
                      size={24}
                      className="text-orange-500 flex-shrink-0 mt-1"
                    />
                    <div>
                      <h4 className="font-bold text-orange-800 mb-3 text-lg">
                        Please complete the following:
                      </h4>
                      <ul className="text-orange-700 space-y-2">
                        {files.length === 0 && (
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Add at least one product image
                          </li>
                        )}
                        {!name && (
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Enter product name
                          </li>
                        )}
                        {!description && (
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Add product description
                          </li>
                        )}
                        {!price && (
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Set original price
                          </li>
                        )}
                        {!offerPrice && (
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Set offer price
                          </li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`px-16 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-4 shadow-2xl ${
                  isLoading
                    ? "bg-p-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-p-700 via-p-800 to-p-900 hover:from-p-800 hover:via-p-900 hover:to-p-950 hover:shadow-3xl"
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus size={24} />
                    Add Product
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
