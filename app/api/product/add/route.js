import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { resolve } from "styled-jsx/css";


// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

export async function POST(request) {
    try {

        const {userId} = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {

            return NextResponse.json({success:false, message:'not authorized'})
            
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const files = formData.getAll('images');
        const colors = formData.get('colors');
        console.log('🔍 Raw colors from formData:', colors);
        let parsedColors = [];
        if (colors) {
                try {
                    parsedColors = JSON.parse(colors);
                    console.log('✅ Parsed colors:', parsedColors);
                    console.log('📊 Colors count:', parsedColors.length);
                } catch (error) {
                    console.log('❌ Error parsing colors:', error);
                    parsedColors = [];
                }
            } else {
                console.log('⚠️  No colors data received');
            }
        if (!files || files.length === 0) {
            return NextResponse.json({success:false, message:'no files uploaded'})
        }
        

        const result = await Promise.all(
            files.map(async(file)=>{
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve,reject)=>{
                    const stream = cloudinary.uploader.upload_stream(
                        {resource_type:'auto'},
                        (error,result) =>{
                                if (error) {
                                    reject(error) 
                                }else{
                                    resolve(result)
                                }
                        }
                    )
                    stream.end(buffer)
                })

            })
        )
        const image = result.map(result => result.secure_url)

        await connectDB();
        console.log('🔍 Creating product with data:', {
                name,
                category,
                colors: parsedColors,
                colorCount: parsedColors.length
            });
        const newProduct = await Product.create({
                    userId,
                    name,
                    description,
                    category,
                    price:Number(price),
                    offerPrice:Number(offerPrice),
                    colors: parsedColors,
                    image,
                    date: Date.now()
                })
            console.log('✅ Product created:', newProduct._id);
console.log('📊 Saved colors:', newProduct.colors);
        return NextResponse.json({success:true, message:'Upload successful',newProduct})

    } catch (error) {
        return NextResponse.json({success:false, message:error.message})
    }
     
}