import { Track } from '../types';
import { formatDuration, formatFileSize } from '../store';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onLike: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onComment: () => void;
}

export function TrackCard({ track, isPlaying, isLiked, onPlay, onLike, onDelete, onDownload, onComment }: TrackCardProps) {
  return (
    <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 ${isPlaying ? 'ring-2 ring-purple-500/50' : ''}`}>
      {/* Album Art */}
      <div
        className="relative aspect-square cursor-pointer"
        style={{ background: track.gradient }}
        onClick={onPlay}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30 select-none">
            {isPlaying ? (
              <div className="flex items-end gap-1 h-12">
                <div className="w-2 bg-white/80 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }}></div>
                <div className="w-2 bg-white/80 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }}></div>
                <div className="w-2 bg-white/80 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms' }}></div>
                <div className="w-2 bg-white/80 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '450ms' }}></div>
              </div>
            ) : (
              <svg className="w-16 h-16 text-white/60 group-hover:text-white/90 transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-mono">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-sm truncate" title={track.title}>{track.title}</h3>
        <p className="text-xs text-gray-400 truncate mt-0.5" title={track.artist}>{track.artist}</p>
        
        {/* Stats row */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">▶ {track.plays}</span>
          <span className="flex items-center gap-1">❤ {track.likes}</span>
          <span className="flex items-center gap-1">⬇ {track.downloads}</span>
          <span className="ml-auto">{formatFileSize(track.fileSize)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3">
          <button
            onClick={onPlay}
            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xs font-semibold hover:opacity-90 transition flex items-center justify-center gap-1"
          >
            {isPlaying ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                Lecture
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Écouter
              </>
            )}
          </button>
          <button onClick={onLike} className={`p-2 rounded-lg transition ${isLiked ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-gray-400 hover:text-pink-400'}`}>
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          <button onClick={onComment} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>
          <button onClick={onDownload} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-green-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
