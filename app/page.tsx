"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Context'i import ettik

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Context'ten hem isimi hem ID'yi kaydetmek için fonksiyonları alıyoruz
  const { setUsername, setUserId } = useUser(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      // 1. Kullanıcı adını hafızaya at
      setUsername(data.user.username);
      
      // 2. Kullanıcı ID'sini hafızaya at (Burası yeni eklendi)
      setUserId(data.user.id);

      // 3. Panele yönlendir
      router.push("/dashboard"); 
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Please enter your details</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:border-blue-500 outline-none transition"
              placeholder="Enter your username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg hover:shadow-blue-500/30">
            Log In
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}