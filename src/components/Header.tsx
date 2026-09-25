import { SortOption } from '../types';

interface HeaderProps {
  search: string;
  setSearch: (v: string) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  onUpload: () => void;
  trackCount: number;
}

export function Header({ search, setSearch, sort, setSort, onUpload, trackCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              🎵
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mes Musiques
              </h1>
              <p className="text-xs text-gray-400">{trackCount} morceau{trackCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un titre ou artiste..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>

          {/* Sort & Upload */}
          <div className="flex items-center gap-3 shrink-0">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-gray-800">Plus récents</option>
              <option value="oldest" className="bg-gray-800">Plus anciens</option>
              <option value="most-liked" className="bg-gray-800">Plus aimés</option>
              <option value="most-played" className="bg-gray-800">Plus écoutés</option>
              <option value="a-z" className="bg-gray-800">A → Z</option>
            </select>

            <button
              onClick={onUpload}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
