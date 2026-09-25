import { Track } from '../types';
import { formatDuration } from '../store';

interface QueuePanelProps {
  tracks: Track[];
  currentTrack: Track | null;
  onSelect: (track: Track) => void;
  onClose: () => void;
}

export function QueuePanel({ tracks, currentTrack, onSelect, onClose }: QueuePanelProps) {
  const currentIdx = currentTrack ? tracks.findIndex(t => t.id === currentTrack.id) : -1;
  const upcoming = currentIdx >= 0 ? tracks.slice(currentIdx + 1) : tracks;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-sm">File d'attente</h3>
              <p className="text-xs text-gray-400">{upcoming.length} morceau{upcoming.length !== 1 ? 's' : ''} à venir</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Queue */}
        <div className="flex-1 overflow-y-auto">
          {/* Now playing */}
          {currentTrack && (
            <div className="p-4 border-b border-white/10">
              <p className="text-xs text-purple-400 font-semibold mb-2">🎧 En cours de lecture</p>
              <div className="flex items-center gap-3 bg-purple-500/10 rounded-xl p-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: currentTrack.gradient }}
                >
                  <span className="text-lg">🎵</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
                  <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
                <span className="text-xs text-gray-500 font-mono">{formatDuration(currentTrack.duration)}</span>
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div className="p-4">
            <p className="text-xs text-gray-400 font-semibold mb-2">À suivre</p>
            {upcoming.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">File d'attente vide</p>
              </div>
            ) : (
              <div className="space-y-1">
                {upcoming.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => onSelect(track)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition text-left"
                  >
                    <span className="text-xs text-gray-500 w-5 text-center font-mono">{idx + 1}</span>
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: track.gradient }}
                    >
                      <span className="text-xs">🎵</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{formatDuration(track.duration)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
