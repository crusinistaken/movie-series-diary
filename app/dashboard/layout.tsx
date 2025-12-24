"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

// --- İKONLAR ---
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>);
const MovieIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m4.875 6.018c.163.03.332.047.506.047.533 0 1.006-.176 1.387-.474m-1.893.427L12 14.25" /></svg>);
const TvIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>);

// --- SIDEBAR BİLEŞENİ ---
const Sidebar = () => {
  const pathname = usePathname();
  const { username, userAvatar } = useUser(); // <--- Avatar bilgisini de çektik!

  const menuItems = [
    { name: "Main Page", href: "/dashboard", icon: <HomeIcon /> },
    { name: "Movies", href: "/dashboard/movies", icon: <MovieIcon /> },
    { name: "Series", href: "/dashboard/series", icon: <TvIcon /> },
    { name: "Profile", href: "/dashboard/profile", icon: <UserIcon /> },
  ];

  return (
    <>
      {/* --- MASAÜSTÜ SIDEBAR (Solda Duran) --- */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-700">
        <div className="p-6 text-2xl font-bold text-blue-500 tracking-wider">
          MY DIARY
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}>
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ALT KULLANICI KISMI */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            
            {/* AVATAR ALANI - ARTIK DİNAMİK! */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden flex items-center justify-center">
                    {userAvatar ? (
                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-bold text-sm">{username ? username.charAt(0).toUpperCase() : "U"}</span>
                    )}
                </div>
            </div>

            <div className="text-sm font-bold text-white line-clamp-1">{username || "User"}</div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-red-400 hover:text-red-300 px-2 transition text-sm font-bold">
            <LogoutIcon /> Log Out 
          </Link>
        </div>
      </div>

      {/* --- MOBİL BOTTOM BAR (Altta Duran) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 flex justify-around items-center p-3 z-50 safe-area-bottom">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-blue-500" : "text-gray-500"}`}>
              {item.icon}
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
        <Link href="/" className="flex flex-col items-center gap-1 text-red-500">
           <LogoutIcon />
           <span className="text-[10px] font-bold">Log Out</span>
        </Link>
      </div>
    </>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 w-full md:p-8 pb-24">
        {children}
      </main>
    </div>
  );
}