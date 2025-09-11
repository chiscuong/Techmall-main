import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
<<<<<<< HEAD
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
=======
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108

export async function PUT(req, { params }) {
  try {
    await connectDB();

<<<<<<< HEAD
    const body = await req.json();
    const { removedImages = [], image, ...rest } = body; // ✅ tách image + removedImages

    // 🔥 Xoá ảnh trên Cloudinary
    await Promise.all(
      removedImages.map(async (url) => {
        try {
          const parts = url.split("/");
          const fileWithExt = parts[parts.length - 1]; 
          const publicId = fileWithExt.split(".")[0]; 
          await cloudinary.uploader.destroy(publicId);
          console.log("🗑 Deleted from Cloudinary:", publicId);
        } catch (err) {
          console.error("❌ Error deleting Cloudinary image:", err);
        }
      })
    );

    // ✅ Update MongoDB (chỉ update image + các field khác)
    const updated = await Product.findByIdAndUpdate(
      params.id,
      { ...rest, image },  // phải là image (không phải images)
      { new: true }
    );
=======
    const body = await req.json(); // Lấy dữ liệu JSON gửi từ client
    const updated = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
    });
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
<<<<<<< HEAD
    console.error("❌ Update error:", err);
=======
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
