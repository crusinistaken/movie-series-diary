"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext"; 

// --- TİP TANIMLAMALARI ---
interface MediaItem {
  _id?: string;
  id?: number;
  tmdbId?: number;
  title?: string;
  name?: string;
  type?: string;
  poster_path?: string;
  posterPath?: string;
  overview?: string;
  status?: string;
  season?: number;
  episode?: number;
  runtime?: string;
  rating?: number;
  userId?: string; 
}

// --- İKONLAR ---
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>);
const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>);

// --- KAYITLI KART (SavedCard) ---
const SavedCard = ({ item, isMovie, onRefresh }: { item: MediaItem, isMovie: boolean, onRefresh: () => void }) => {
  const [loading, setLoading] = useState(false);
  const posterUrl = item.posterPath || item.poster_path ? `https://image.tmdb.org/t/p/w200${item.posterPath || item.poster_path}` : "/images/placeholder.png";
  const [imgSrc, setImgSrc] = useState(posterUrl);

  const handleDelete = async () => {
    if (!confirm("Delete this from your list?")) return;
    setLoading(true);
    try { await fetch(`/api/media?id=${item._id}`, { method: "DELETE" }); onRefresh(); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateItem = async (updates: Partial<MediaItem>) => {
    setLoading(true);
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, ...updates }),
      });
      onRefresh();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg flex overflow-hidden hover:border-gray-500 transition shadow-lg group relative">
      <button onClick={handleDelete} disabled={loading} className="w-12 bg-gray-900/50 hover:bg-red-600/90 text-gray-500 hover:text-white flex items-center justify-center transition-all border-r border-gray-700"><TrashIcon /></button>
      <div className="relative w-24 h-auto flex-shrink-0 bg-gray-700">
        <img src={imgSrc} alt={item.title} className="w-full h-full object-cover" onError={() => setImgSrc("/images/placeholder.png")} />
        {item.rating && item.rating > 0 && (<div className="absolute top-1 left-1 bg-yellow-500 text-black font-bold text-xs px-1.5 py-0.5 rounded shadow flex items-center gap-0.5"><span className="text-[10px]">★</span>{item.rating}</div>)}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
          {item.status === 'watching' && (<div className="text-blue-400 text-sm font-mono mt-1 flex items-center gap-2">{!isMovie ? ( <><span>📺</span> <span>S:{item.season} E:{item.episode}</span></> ) : ( <><span>⏳</span> <span>{item.runtime || "00:00"}</span></> )}</div>)}
          {item.status === 'completed' && (
             <div className="mt-2 flex items-center gap-2 animate-fadeIn">
                <span className="text-yellow-500 flex items-center gap-1 text-sm font-bold"><StarIcon /> Rating:</span>
                <select value={item.rating || ""} onChange={(e) => updateItem({ rating: Number(e.target.value) })} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-yellow-500 focus:outline-none cursor-pointer">
                    <option value="" disabled>-</option>
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (<option key={num} value={num}>{num}</option>))}
                </select>
                <span className="text-gray-500 text-xs">/10</span>
             </div>
          )}
        </div>
        <div className="mt-2 flex justify-end">
            {item.status === 'watching' && (<button onClick={() => updateItem({ status: 'completed' })} disabled={loading} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold transition"><CheckIcon /> Complete</button>)}
            {item.status === 'plan_to_watch' && (<button onClick={() => updateItem({ status: 'watching' })} disabled={loading} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold transition"><PlayIcon /> Start Watching</button>)}
            {item.status === 'completed' && (<span className="text-xs font-bold text-green-500 border border-green-500 px-2 py-1 rounded select-none">COMPLETED</span>)}
        </div>
      </div>
    </div>
  );
};

// --- ARAMA KARTI (ResultCard) ---
const ResultCard = ({ item, isMovie, onSaved }: { item: MediaItem, isMovie: boolean, onSaved: () => void }) => {
  const { userId } = useUser(); 
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [runtime, setRuntime] = useState("");
  const [status, setStatus] = useState("watching"); 

  const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "/images/placeholder.png";
  const [imgSrc, setImgSrc] = useState(posterUrl);

  const handleSave = async () => {
    if (!userId) { alert("Please login first!"); return; }

    setLoading(true);
    try {
      const payload = {
        userId: userId,
        tmdbId: item.id || item.tmdbId,
        title: item.title || item.name,
        type: isMovie ? "movie" : "series",
        posterPath: item.poster_path,
        overview: item.overview,
        status: status,
        season: isMovie ? undefined : Number(season),
        episode: isMovie ? undefined : Number(episode),
        runtime: isMovie ? runtime : undefined,
      };

      await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSaved(true); onSaved();
    } catch (e) { console.error(e); alert("Hata"); } finally { setLoading(false); }
  };

  return (
    <div className="border border-gray-700 p-4 rounded flex gap-4 hover:bg-gray-750 transition bg-gray-900/50">
      <img src={imgSrc} alt={item.title || item.name} className="w-20 h-28 object-cover rounded bg-gray-700" onError={() => setImgSrc("/images/placeholder.png")} />
      <div className="flex-1">
        <h3 className="font-bold text-white">{item.title || item.name}</h3>
        <div className="flex flex-wrap gap-2 mt-3 items-center">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-gray-800 text-sm p-1.5 rounded border border-gray-600 text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="plan_to_watch">Plan to Watch</option>
            </select>
            {!isMovie ? (
                <div className="flex items-center gap-1">
                    <input type="number" min="1" value={season} onChange={(e) => setSeason(Number(e.target.value))} className="w-12 p-1.5 bg-gray-800 border border-gray-600 rounded text-center text-sm" placeholder="S" />
                    <span className="text-gray-500">:</span>
                    <input type="number" min="1" value={episode} onChange={(e) => setEpisode(Number(e.target.value))} className="w-12 p-1.5 bg-gray-800 border border-gray-600 rounded text-center text-sm" placeholder="Ep" />
                </div>
            ) : (
                <input type="text" placeholder="01:20" value={runtime} onChange={(e) => setRuntime(e.target.value)} className="w-20 p-1.5 bg-gray-800 border border-gray-600 rounded text-center text-sm" />
            )}
            <button onClick={handleSave} disabled={loading || saved} className={`ml-auto text-sm px-4 py-1.5 rounded font-bold ${saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                {loading ? "..." : saved ? "Saved" : "Save"}
            </button>
        </div>
      </div>
    </div>
  );
};

// --- ANA SAYFA (CategoryPage) ---
export default function CategoryPage() {
  const { userId } = useUser();
  
  const params = useParams();
  const category = params.category as string;
  const isMovie = category === "movies";

  const [activeTab, setActiveTab] = useState("watching");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [savedItems, setSavedItems] = useState<MediaItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const fetchMyList = async () => {
    if (!userId) return; 
    try { 
        const res = await fetch(`/api/media?userId=${userId}`, { cache: "no-store" }); 
        const json = await res.json(); 
        if (json.data) setSavedItems(json.data); 
    } catch (err) { console.error(err); }
  };
  
  useEffect(() => { fetchMyList(); }, [userId]); 

  const searchTMDB = async () => {
    if (!query) return;
    setLoadingSearch(true);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const type = isMovie ? "movie" : "tv";
    try { const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${query}&language=en-US`); const data = await res.json(); setSearchResults(data.results || []); } catch (error) { console.error(error); } finally { setLoadingSearch(false); }
  };

  const filteredList = savedItems.filter(item => {
    const typeMatch = isMovie ? item.type === 'movie' : item.type === 'series';
    const statusMatch = item.status === activeTab.replace(/ /g, "_");
    return typeMatch && statusMatch;
  });

  return (
    // Mobilde p-3, Masaüstünde p-6
    <div className="min-h-screen bg-gray-900 text-white md:p-6 p-2">
      <div className="max-w-4xl mx-auto">
        
        {/* Başlık Alanı */}
        <div className="flex items-center gap-3 mb-6 mt-2 md:mt-0">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition bg-gray-800 p-2 rounded-full md:bg-transparent md:p-0">←</Link>
            <h1 className="text-2xl md:text-3xl font-bold capitalize">{category} Diary</h1>
        </div>

        {/* Sekmeler (Mobilde parmakla sağa sola kaydırılabilir) */}
        <div className="flex gap-2 mb-0 overflow-x-auto pb-2 scrollbar-hide">
            {["watching", "completed", "plan to watch", "add new"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 md:px-6 md:py-3 whitespace-nowrap rounded-t-lg font-bold text-xs md:text-sm transition uppercase flex-shrink-0 ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                {tab}
            </button>
            ))}
        </div>

        {/* Ana İçerik Kutusu */}
        <div className="bg-gray-800 p-3 md:p-6 rounded-b-lg rounded-tr-lg min-h-[500px] shadow-2xl">
            
            {/* ARAMA VE EKLEME EKRANI */}
            {activeTab === "add new" && (
            <div>
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchTMDB()} placeholder={`Search ${isMovie ? "movies" : "tv shows"}...`} className="flex-1 p-3 bg-gray-900 rounded border border-gray-700 focus:border-blue-500 w-full" />
                    <button onClick={searchTMDB} className="bg-blue-600 px-6 py-3 rounded font-bold w-full md:w-auto">{loadingSearch ? "..." : "Search"}</button>
                </div>
                <div className="space-y-4">
                    {searchResults.map((item) => ( <ResultCard key={item.id || item.tmdbId} item={item} isMovie={isMovie} onSaved={fetchMyList} /> ))}
                </div>
            </div>
            )}

            {/* LİSTE EKRANI */}
            {activeTab !== "add new" && (
                // Mobilde tek sütun (grid-cols-1), Masaüstünde iki sütun (md:grid-cols-2)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {filteredList.length > 0 ? ( filteredList.map((item) => ( <SavedCard key={item._id} item={item} isMovie={isMovie} onRefresh={fetchMyList} /> )) ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500"><p className="text-xl mb-2">Liste boş.</p></div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}