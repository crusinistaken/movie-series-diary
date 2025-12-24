import Link from "next/link";

export default function DashboardSelection() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12">What do you want to track?</h1>
      
      <div className="flex gap-8">
        {/* MOVIES CARD */}
        <Link href="/dashboard/movies" className="group">
          <div className="w-64 h-80 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-blue-500 flex flex-col items-center justify-center transition transform hover:-translate-y-2 cursor-pointer shadow-xl">
            <span className="text-6xl mb-4">🎬</span>
            <h2 className="text-2xl font-bold group-hover:text-blue-400">Movies</h2>
          </div>
        </Link>

        {/* SERIES CARD */}
        <Link href="/dashboard/series" className="group">
          <div className="w-64 h-80 bg-gray-800 rounded-2xl border-2 border-gray-700 hover:border-green-500 flex flex-col items-center justify-center transition transform hover:-translate-y-2 cursor-pointer shadow-xl">
            <span className="text-6xl mb-4">📺</span>
            <h2 className="text-2xl font-bold group-hover:text-green-400">Series</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}