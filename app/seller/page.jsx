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
    <div className="min-h-screen  py-8 px-4 flex items-center justify-center relative ">
      <div className="w-full max-w-4xl mx-auto">
        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-p-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-p-700 to-p-800 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Package size={24} />
              Product Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Image Upload Section */}
            <div>
              <label className="block text-lg font-semibold text-p-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} />
                Product Images
              </label>

              <div
                className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                  dragActive
                    ? "border-p-600 bg-p-50"
                    : "border-p-300 hover:border-p-500 hover:bg-p-25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center mb-6">
                  <Upload size={48} className="text-p-400 mx-auto mb-4" />
                  <p className="text-p-600 mb-2">
                    Drag & drop images here or click to browse
                  </p>
                  <p className="text-sm text-p-500">
                    Maximum 4 images, PNG or JPG format
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${
                            files[index]
                              ? "border-green-400 bg-green-50"
                              : "border-p-300 hover:border-p-500"
                          }`}
                        >
                          {files[index] ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={URL.createObjectURL(files[index])}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover rounded-lg"
                                width={150}
                                height={150}
                              />
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeFile(index);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                              >
                                <X size={16} />
                              </motion.button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Plus
                                size={24}
                                className="text-p-400 mx-auto mb-2"
                              />
                              <p className="text-sm text-p-500">Add Image</p>
                            </div>
                          )}
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Product Name */}
              <div>
                <label className="block text-lg font-semibold text-p-800 mb-3 flex items-center gap-2">
                  <Package size={18} />
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-semibold text-p-800 mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Category
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800 appearance-none bg-white"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-lg font-semibold text-p-800 mb-3 flex items-center gap-2">
                  <DollarSign size={18} />
                  Original Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                />
              </div>

              {/* Offer Price */}
              <div>
                <label className="block text-lg font-semibold text-p-800 mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Offer Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                  onChange={(e) => setOfferPrice(e.target.value)}
                  value={offerPrice}
                  required
                />
                {price &&
                  offerPrice &&
                  parseFloat(offerPrice) < parseFloat(price) && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <Check size={16} />
                      <span>
                        Discount:{" "}
                        {Math.round(((price - offerPrice) / price) * 100)}%
                      </span>
                    </div>
                  )}
              </div>
            </div>
            {/* Color Selection Section */}
            <div>
              <label className="block text-lg font-semibold text-p-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-blue-500"></div>
                Product Colors
              </label>

              {/* Predefined Colors */}
              <div className="mb-6">
                <p className="text-sm text-p-600 mb-3">
                  Choose from predefined colors:
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {predefinedColors.map((color) => (
                    <motion.div
                      key={color.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer`}
                      onClick={() => toggleColor(color)}
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                          selectedColors.find((c) => c.value === color.value)
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
                              size={20}
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
              <div className="mb-6">
                <p className="text-sm text-p-600 mb-3">
                  Or add a custom color:
                </p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 border-p-200 cursor-pointer"
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={addCustomColor}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-p-600 text-white rounded-xl hover:bg-p-700 transition-colors"
                    disabled={!customColor}
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Selected Colors Display */}
              {selectedColors.length > 0 && (
                <div>
                  <p className="text-sm text-p-600 mb-3">
                    Selected colors ({selectedColors.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((color) => (
                      <motion.div
                        key={color.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 bg-p-50 border border-p-200 rounded-full px-3 py-2"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <span className="text-sm text-p-700">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color.value)}
                          className="text-p-400 hover:text-p-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-p-800 mb-3 flex items-center gap-2">
                <FileText size={18} />
                Product Description
              </label>
              <textarea
                rows={5}
                placeholder="Describe your product in detail..."
                className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 resize-none text-p-800"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />
              <div className="mt-2 text-sm text-p-500">
                {description.length}/500 characters
              </div>
            </div>

            {/* Validation Warnings */}
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
                  className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle
                    size={20}
                    className="text-orange-500 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-medium text-orange-800 mb-2">
                      Complete the form
                    </h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      {files.length === 0 && (
                        <li>• Add at least one product image</li>
                      )}
                      {!name && <li>• Enter product name</li>}
                      {!description && <li>• Add product description</li>}
                      {!price && <li>• Set original price</li>}
                      {!offerPrice && <li>• Set offer price</li>}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-2xl ${
                  isLoading
                    ? "bg-p-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-p-700 to-p-800 hover:from-p-800 hover:to-p-900"
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
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
