"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface ImageType {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function ImagesPage() {
  const { isSignedIn } = useUser();
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/get-user-images");
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <p className="text-center text-red-500">لطفا وارد حساب کاربری خود شوید</p>;
  }

  if (loading) {
    return <p className="text-center">در حال بارگذاری...</p>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-5">تصاویر شما</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image._id} className="border p-3 rounded-lg shadow-md">
            <Image src={image.url} alt={image.name} width={400} height={300} className="rounded-lg" />
            <p className="mt-2 text-center">{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
