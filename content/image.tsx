"use client";

import React, { Children } from "react";
import toast, { Toast } from "react-hot-toast";
import { generateImageai } from "../actions/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Imagetype {
  imageUrl: string;
}

interface ImageContextType {
  ImagePrompt: string;
  setImagePrompt: (query: string) => void;
  Loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  generateImage: (e: React.FormEvent) => Promise<void>; // updated this line
}

const ImageContex = React.createContext<ImageContextType | undefined>(
  undefined
);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [ImagePrompt, setImagePrompt] = React.useState("");
  const [Loading, setLoading] = React.useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!isSignedIn) {
      toast.loading("please sign in to generate image", { position: "bottom-right" });
    }
    try {
      const { _id } = await generateImageai(ImagePrompt);
      router.push("/dashboard/images");
    } catch (err) {
      toast.error("failed to generate image", { position: "bottom-right" });
    }
  };

  return (
    <ImageContex.Provider
      value={{
        Loading,
        setLoading,
        generateImage,
        ImagePrompt,
        setImagePrompt,
      }}
    >
      {children}
    </ImageContex.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = React.useContext(ImageContex);
  if (context == undefined) {
    throw new Error("useImage must be used within an ImageProvider ");
  }
  return context;
};
