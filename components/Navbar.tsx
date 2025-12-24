"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext"; // <--- HAFıZAYI ÇAĞIRDIK
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { userAvatar } = useUser(); // <--- GLOBAL AVATARI ALDIK
  
  // Resim kaynağı yönetimi (Hata olursa yedek görsel devreye girer)
  const [imgSrc, setImgSrc] = useState(userAvatar);

  // Avatar değiştiğinde imgSrc'yi de güncelle
  if (imgSrc !== userAvatar && !imgSrc.includes("/images/default-user.png")) {
    setImgSrc(userAvatar);
  }

  if (pathname === "/") return null;

  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 h-16 px-8 flex flex-row items-center justify-between sticky top-0 z-50 shadow-md">
      
      <div className="flex items-center">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tighter text-white hover:text-blue-400 transition flex items-center gap-2">
          <span>🎬</span> 
          <span>M&S Diary</span>
        </Link>
      </div>

      <div className="flex flex-row items-center gap-6">
        <Link href="/dashboard" className="text-white text-sm font-medium hover:text-blue-400 transition">
          Main Page
        </Link>

        <Link href="/profile" className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-full border border-gray-600 hover:border-blue-500 transition">
          <img 
            src={imgSrc} // <--- ARTIK STATİK DEĞİL
            alt="Profile" 
            className="w-6 h-6 rounded-full object-cover bg-gray-600"
            onError={() => setImgSrc("/images/default-user.png")} // <--- HATA OLURSA YEDEK GÖRSEL
          />
          <span className="text-white text-sm hidden sm:block">Profile</span>
        </Link>

        <div className="w-px h-5 bg-gray-600"></div>

        <Link href="/" className="text-red-400 text-sm font-bold hover:text-red-300 transition">
          Log Out
        </Link>

      </div>

    </nav>
  );
}