"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! You can now login.");
      router.push("/"); // Giriş sayfasına yönlendir
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 outline-none"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition">
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account? <Link href="/" className="text-blue-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}