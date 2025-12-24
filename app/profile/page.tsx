"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/context/UserContext"; // <--- HAFıZAYI ÇAĞIRDIK

// --- YEREL AVATAR LİSTESİ ---
const AVATAR_OPTIONS = [
  // url kısmına senin koyduğun dosya isimlerini yaz
  { name: "The Chemist", url: "/avatars/avatar1.png" }, 
  { name: "The Dragon", url: "/avatars/avatar2.png" },
  { name: "The Detective", url: "/avatars/avatar3.png" },
  { name: "The Villain", url: "/avatars/avatar4.png" },
];

export default function ProfilePage() {
  // --- GLOBAL STATE KULLANIMI ---
const { userAvatar, setUserAvatar, username } = useUser();  
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  
  // Resim Hata Yönetimi
  const [mainImgSrc, setMainImgSrc] = useState(userAvatar);
  if (mainImgSrc !== userAvatar && !mainImgSrc.includes("/images/default-user.png")) {
    setMainImgSrc(userAvatar);
  }


  const handleSave = async () => {
    // 1. Yeni şifreler eşleşiyor mu kontrolü
    if (passwords.new && passwords.new !== passwords.confirm) {
      alert("New passwords do not match!"); 
      return;
    }

    // 2. Eğer şifre kutuları boşsa işlem yapma (veya sadece avatar kaydetmiş say)
    if (!passwords.current && !passwords.new) {
        alert("Avatar updated! (No password change requested)");
        return;
    }

    setLoading(true);

    try {
      // 3. API'ye istek at
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username, // Context'ten gelen isim
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Success: " + data.message);
        setPasswords({ current: "", new: "", confirm: "" }); // Kutuları temizle
      } else {
        alert("Error: " + data.message); // Örn: "Mevcut şifre yanlış"
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
            
            {/* BÜYÜK PROFİL RESMİ */}
            <div className="relative z-10 w-40 h-40 mb-4 group">
              <img 
                src={mainImgSrc} // <--- Global veri
                alt="Profile" 
                className="w-full h-full rounded-full border-4 border-gray-700 shadow-lg bg-gray-600 object-cover"
                onError={() => setMainImgSrc("/images/default-user.png")} // <--- Hata yönetimi
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-800"></div>
            </div>

<h1 className="text-3xl font-bold mb-1">{username || "Misafir"}</h1>            <p className="text-gray-400 text-sm mb-6">user@example.com</p>

            <div className="grid grid-cols-2 gap-4 w-full border-t border-gray-700 pt-6">
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <span className="block text-2xl font-bold text-blue-400">12</span>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Movies</span>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <span className="block text-2xl font-bold text-green-400">5</span>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Series</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard" className="block w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-center rounded-xl font-bold transition">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-500">🎭</span> Choose Your Character
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {AVATAR_OPTIONS.map((avatar, index) => (
                <button
                  key={index}
                  // TIKLAYINCA GLOBAL STATE'İ GÜNCELLİYORUZ
                  onClick={() => setUserAvatar(avatar.url)} 
                  className={`group relative rounded-full p-1 transition-all ${
                    userAvatar === avatar.url  // <--- Karşılaştırmayı global veriyle yapıyoruz
                    ? "ring-4 ring-blue-500 bg-blue-500/20 scale-110" 
                    : "hover:bg-gray-700 ring-2 ring-transparent hover:ring-gray-600"
                  }`}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-full h-full rounded-full bg-gray-600 object-cover" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
                    {avatar.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-yellow-500">🔒</span> Security Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1 ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1 ml-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 ml-1">Confirm Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className={`w-full bg-gray-900 border rounded-lg p-3 text-white focus:outline-none ${
                        passwords.confirm && passwords.new !== passwords.confirm 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-gray-600 focus:border-blue-500"
                    }`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}