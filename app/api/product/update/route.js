import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Get product details for editing
export async function GET(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();
        const product = await Product.findOne({ _id: params.id, userId });

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

// PUT - Update product
export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const files = formData.getAll('images');
        const colors = formData.get('colors');
        const existingImages = formData.get('existingImages');

        console.log('🔍 Raw colors from formData:', colors);
        let parsedColors = [];
        if (colors) {
            try {
                parsedColors = JSON.parse(colors);
                console.log('✅ Parsed colors:', parsedColors);
            } catch (error) {
                console.log('❌ Error parsing colors:', error);
                parsedColors = [];
            }
        }

        let parsedExistingImages = [];
        if (existingImages) {
            try {
                parsedExistingImages = JSON.parse(existingImages);
            } catch (error) {
                console.log('❌ Error parsing existing images:', error);
            }
        }

        await connectDB();

        // Check if product exists and belongs to user
        const existingProduct = await Product.findOne({ _id: params.id, userId });
        if (!existingProduct) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        let imageUrls = [...parsedExistingImages];

        // Upload new images if any
        if (files && files.length > 0 && files[0].size > 0) {
            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                })
            );

            const newImageUrls = uploadResults.map(result => result.secure_url);
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            {
                name,
                description,
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                colors: parsedColors,
                image: imageUrls,
                updatedAt: Date.now()
            },
            { new: true }
        );

        console.log('✅ Product updated:', updatedProduct._id);
        return NextResponse.json({ 
            success: true, 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });

    } catch (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}