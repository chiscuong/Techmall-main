"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin sản phẩm theo ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${id}`);
        if (data.success) {
          setProduct(data.product);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Submit cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/product/update/${id}`, product);
      if (data.success) {
        toast.success("Product updated!");
        router.push("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loading />;

  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Product name"
        />
        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Price"
        />
        <input
          type="number"
          value={product.offerPrice}
          onChange={(e) =>
            setProduct({ ...product, offerPrice: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Offer Price"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
