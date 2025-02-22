import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserImagesFromDb } from "@/actions/image";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 10;

    const { images, totalCount } = await getUserImagesFromDb(page, limit);
    return NextResponse.json({ images, totalCount });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
