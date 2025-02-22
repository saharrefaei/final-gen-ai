"use server";
import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/utlis/db";
import { Image } from "@/model/image";
import { skip } from "node:test";

export async function generateImageai(imagePrompt: string) {
  try {
    // ✅ بررسی احراز هویت کاربر
    const { userId } = await auth();
    if (!userId) {
      console.log("❌ User not authenticated. Redirecting...");
    }
    console.log("✅ User is authenticated:", userId);

    // ✅ دریافت اطلاعات کاربر از Clerk
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const userName = user?.fullName;

    // ✅ اتصال به پایگاه داده
    await db();

    // ✅ بررسی مقادیر متغیرهای محیطی
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("❌ REPLICATE_API_TOKEN is missing!");
    }
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("❌ Cloudinary configuration is missing!");
    }

    // ✅ مقداردهی اولیه Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // ✅ مقداردهی اولیه Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // ✅ مقداردهی prompt برای مدل هوش مصنوعی
    const input = {
      prompt: imagePrompt,
      output_format: "png",
      output_quality: 80,
      aspect_tatio: "16.09",
    };

    // ✅ اجرای مدل Replicate
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input,
    });

    // 🔴 بررسی مقدار output (ممکن است خالی باشد)
    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error("❌ Replicate output is invalid!");
    }

    // ✅ دریافت تصویر از URL تولید شده
    const imageUrl = output[0];
    console.log("✅ Image generated:", imageUrl);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("❌ Failed to fetch image: ${response.statusText}");
    }

    // تبدیل تصویر به Buffer
    const buffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    // ✅ آپلود تصویر به Cloudinary
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai_images",
          public_id: nanoid(),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(nodeBuffer);
    });

    // ✅ بررسی نتیجه آپلود
    if (!uploadResponse || !uploadResponse.secure_url) {
      throw new Error("❌ Failed to upload image to Cloudinary");
    }

    // ✅ لینک تصویر آپلود شده
    const cloudinaryUrl = uploadResponse.secure_url;
    const image = await new Image({
      userEmail,
      userName,
      name: imagePrompt,
      url: cloudinaryUrl,
    }).save();
    return {
      success: true,
      _id: image._id.toString(),
    };
    return cloudinaryUrl;
  } catch (err) {
    console.error("❌ Error in generateImageai:", err);
    throw new Error("Failed to generate image");
  }
}

export const getUserImagesFromDb = async (page: number, limit: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const [images, totalCount] = await Promise.all([
      Image.find({ userEmail })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit),
      Image.countDocuments({ userEmail }),
    ]);

    return {
      images:JSON.parse(JSON.stringify(images)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};
