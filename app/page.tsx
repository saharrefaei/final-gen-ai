import HeroImage from "@/components/display/hero-image-slider";
import ImageGenerate from "../components/forms/generate-image-input";
// import Contact from "./chat/page";

export default function Home() {
  return (
    <div className="flex items-center justify-center m-5 ">
      <div className="grid max-w-4xl">
        <div className="my-10">
          <h1 className="text-7xl lg:text-9xl font-bold mb-2">
            <span className="text-8xl bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text animate-pulse">
              AI
            </span>
            <br />
            image Genarator
          </h1>
          <p className="mt-10">
            🎨 Simply log in and describe the image you have in mind! 🎭✨ <br />
            Our AI will generate your desired image in seconds 💼 completely free 🚀🖼️
          </p>
        </div>
        <ImageGenerate />
        <div className="relative">
          <HeroImage />

          <div className="mt-40">
          {/* <Contact /> */}
        </div>
        </div>
      </div>
    </div>
  );
}
