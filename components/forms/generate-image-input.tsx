"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useImage } from "@/content/image";
import { Loader2Icon } from "lucide-react";

export default function ImageGenerate() {
  const { generateImage, ImagePrompt, setImagePrompt, Loading } = useImage();
  return (
    <form onSubmit={generateImage}>
      <div className="mb-5 flex scale-x-2">
        <Input placeholder="mountain loocout" value={ImagePrompt} onChange={(e)=>setImagePrompt(e.target.value)} className="p-6 lg:p-8 text-lg " />
        <Button onClick={generateImage} disabled={Loading} className="p-6 ml-3 mt-2">

        {Loading ? (
  <Loader2Icon className="animate-spin mr-2"/>):(<div>Generate Image</div>) } 


</Button>
      </div>
    </form>
  );
}