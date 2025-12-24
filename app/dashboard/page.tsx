"use client";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fadeIn p-4">
      
      {/* Başlık */}
      <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-center leading-tight">
        What do you want <br className="md:hidden"/> to track?
      </h1>
      
      {/* Kartlar Kutusu */}
      {/* Mobilde: flex-col (Alt alta) | Masaüstünde: md:flex-row (Yan yana) */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        
        {/* --- MOVIES CARD --- */}
        <Link href="/dashboard/movies" className="group flex-1 bg-gray-800 hover:bg-gray-800/80 border border-gray-700 hover:border-blue-500 rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🎬
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">Movies</h2>
            <p className="text-gray-400 text-sm mt-2">Track the movies you watched</p>
        </Link>

        {/* --- SERIES CARD --- */}
        <Link href="/dashboard/series" className="group flex-1 bg-gray-800 hover:bg-gray-800/80 border border-gray-700 hover:border-purple-500 rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 shadow-2xl">
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
              📺
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition">Series</h2>
            <p className="text-gray-400 text-sm mt-2">Track the TV shows you follow</p>
        </Link>

      </div>
    </div>
  );
}