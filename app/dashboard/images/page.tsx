"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface ImageData {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function UserImagesPage() {
  const { isSignedIn } = useUser();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    async function fetchImages() {
      try {
        const res = await fetch("/api/images?page=0&limit=20");
        const data = await res.json();
        if (res.ok) {
          setImages(data.images);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error fetching images");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <p>Please sign in to view your images.</p>;
  }

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Generated Images</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="border p-2 rounded-lg shadow">
            <Image src={img.url} alt={img.name} width={300} height={300} className="rounded-lg"/>
            <p className="mt-2 text-center text-sm">{img.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
