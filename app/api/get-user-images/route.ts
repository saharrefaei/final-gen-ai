import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/utlis/db";
import { Image } from "@/model/image";

export async function GET() {
  try {
    await db(); // اتصال به پایگاه داده
    const { userId } = await auth(); // دریافت شناسه کاربر از Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userImages = await Image.find({ userEmail: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ images: userImages });
  } catch (error) {
    console.error("Error fetching user images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
