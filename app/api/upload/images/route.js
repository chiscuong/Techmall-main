import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images");

    console.log("📥 Files received:", files.map(f => f.name || "blob"));

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });
      return uploadResult.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    console.log("✅ Uploaded to Cloudinary:", imageUrls);

    return NextResponse.json({ success: true, imageUrls });
  } catch (err) {
    console.error("❌ Upload error (backend):", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
