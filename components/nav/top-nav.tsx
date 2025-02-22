import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

export default function TopNav() {
  return (
    <div className="flex items-center justify-center p-5 shadow space-x-10">
     <Toaster/>
      <div className="text-2xl font-bold">
        <Link href="/">
          <Image
            src="/logos/logo.svg"
            alt="ai image generator logo"
            width={50}
            height={50}
          />
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <SignedOut>
          <SignInButton >
          <LogIn className="h-10 w-8 text-[#6a5acd] cursor-pointer"/>          
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
