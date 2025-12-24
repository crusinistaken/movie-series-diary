"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

// --- İKONLAR ---
const MovieIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m4.875 6.018c.163.03.332.047.506.047.533 0 1.006-.176 1.387-.474m-1.893.427L12 14.25" /></svg>);
const TvIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>);

export default function ProfilePage() {
  const { userId, username } = useUser();
  const [stats, setStats] = useState({ movies: 0, series: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
      try {
        // Tüm listeyi çekiyoruz
        const res = await fetch(`/api/media?userId=${userId}`);
        const json = await res.json();
        
        if (json.data) {
          // Javascript ile sayıları hesaplıyoruz
          const moviesCount = json.data.filter((i: any) => i.type === 'movie').length;
          const seriesCount = json.data.filter((i: any) => i.type === 'series').length;
          const completedCount = json.data.filter((i: any) => i.status === 'completed').length;
          
          setStats({ movies: moviesCount, series: seriesCount, completed: completedCount });
        }
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      
      {/* Üst Kısım: Avatar ve İsim */}
      <div className="mt-10 mb-8 text-center animate-fadeIn">
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
          <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center text-4xl font-bold uppercase">
             {username ? username.charAt(0) : "U"}
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-4">{username || "User Profile"}</h1>
        <p className="text-gray-400">Movie & Series Tracker</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        
        {/* Movies Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-blue-500/10 p-4 rounded-lg">
            <MovieIcon />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Movies</p>
            <p className="text-3xl font-bold">{loading ? "..." : stats.movies}</p>
          </div>
        </div>

        {/* Series Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-purple-500/10 p-4 rounded-lg">
            <TvIcon />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Series</p>
            <p className="text-3xl font-bold">{loading ? "..." : stats.series}</p>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <StarIcon />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-3xl font-bold">{loading ? "..." : stats.completed}</p>
          </div>
        </div>

      </div>

      {/* Dashboard'a Dön Butonu */}
      <Link href="/dashboard" className="mt-12 text-blue-400 hover:text-white transition flex items-center gap-2 font-bold">
        ← Back to Dashboard
      </Link>

    </div>
  );
}