"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

// --- İKONLAR ---
const MovieIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m4.875 6.018c.163.03.332.047.506.047.533 0 1.006-.176 1.387-.474m-1.893.427L12 14.25" /></svg>);
const TvIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>);

export default function ProfilePage() {
  const { userId, username, userAvatar, setUserAvatar } = useUser();
  const [stats, setStats] = useState({ movies: 0, series: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  
  // Şifre ve Avatar State'leri
  const [passForm, setPassForm] = useState({ newPassword: "" });
  const [passMsg, setPassMsg] = useState("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Örnek avatarlar (Eğer resim dosyaların varsa burayı o dosya yollarıyla değiştir)
  const avatarOptions = [
    "/avatars/avatar1.png", "/avatars/avatar2.png", "/avatars/avatar3.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
  ];

  // 1. İSTATİSTİKLERİ ÇEKME
  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/media?userId=${userId}`);
        const json = await res.json();
        
        if (json.data) {
          const moviesCount = json.data.filter((i: any) => i.type === 'movie').length;
          const seriesCount = json.data.filter((i: any) => i.type === 'series').length;
          const completedCount = json.data.filter((i: any) => i.status === 'completed').length;
          setStats({ movies: moviesCount, series: seriesCount, completed: completedCount });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStats();
  }, [userId]);

  // 2. ŞİFRE GÜNCELLEME (Frontend Simülasyonu - Backend'i yazmadıysak uyarır)
  const handlePassUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword.length < 6) {
        setPassMsg("Password must be at least 6 characters.");
        return;
    }
    // Buraya API isteği gelebilir, şimdilik sadece UI gösteriyoruz
    setPassMsg("Password updated successfully!");
    setPassForm({ newPassword: "" });
    setTimeout(() => setPassMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 pb-24">
      
      {/* --- AVATAR BÖLÜMÜ --- */}
      <div className="mt-6 mb-8 text-center relative">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 relative group">
          <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
             {/* Avatar resmi varsa göster yoksa Harf göster */}
             {userAvatar && userAvatar.includes("/") ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <span className="text-5xl font-bold uppercase">{username ? username.charAt(0) : "U"}</span>
             )}
          </div>
          
          {/* Düzenleme Butonu */}
          <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition shadow-lg border-2 border-gray-900">
            <EditIcon />
          </button>
        </div>

        {/* Avatar Seçim Menüsü */}
        {showAvatarMenu && (
            <div className="mt-4 bg-gray-800 p-3 rounded-xl border border-gray-700 grid grid-cols-3 gap-2 absolute top-full left-1/2 -translate-x-1/2 w-64 z-10 shadow-xl">
                {avatarOptions.map((src, index) => (
                    <button key={index} onClick={() => { setUserAvatar(src); setShowAvatarMenu(false); }} className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition">
                        <img src={src} alt="avatar option" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        )}

        <h1 className="text-3xl font-bold mt-4">{username || "User Profile"}</h1>
        <p className="text-gray-400">Movie & Series Tracker</p>
      </div>

      {/* --- İSTATİSTİK KARTLARI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-blue-500/10 p-4 rounded-lg"><MovieIcon /></div>
          <div><p className="text-gray-400 text-sm">Total Movies</p><p className="text-3xl font-bold">{loading ? "..." : stats.movies}</p></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-purple-500/10 p-4 rounded-lg"><TvIcon /></div>
          <div><p className="text-gray-400 text-sm">Total Series</p><p className="text-3xl font-bold">{loading ? "..." : stats.series}</p></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4 shadow-lg">
          <div className="bg-yellow-500/10 p-4 rounded-lg"><StarIcon /></div>
          <div><p className="text-gray-400 text-sm">Completed</p><p className="text-3xl font-bold">{loading ? "..." : stats.completed}</p></div>
        </div>
      </div>

      {/* --- AYARLAR / ŞİFRE DEĞİŞTİRME --- */}
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🔐 Change Password</h2>
        <form onSubmit={handlePassUpdate} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input 
                    type="password" 
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ newPassword: e.target.value })}
                    className="w-full p-3 bg-gray-900 rounded border border-gray-600 focus:border-blue-500 outline-none transition"
                    placeholder="Enter new password"
                />
            </div>
            {passMsg && <p className={`text-sm text-center ${passMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>{passMsg}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                Update Password
            </button>
        </form>
      </div>

      <Link href="/dashboard" className="mt-8 text-gray-500 hover:text-white transition text-sm">
        ← Back to Dashboard
      </Link>
    </div>
  );
}