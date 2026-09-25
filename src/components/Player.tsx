import { useRef, useEffect } from 'react';
import { Track, RepeatMode } from '../types';
import { formatDuration } from '../store';

interface PlayerProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isLiked: boolean;
  analyserNode: AnalyserNode | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (v: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onShowQueue: () => void;
  onShowComments: () => void;
}

export function Player({
  track, isPlaying, currentTime, duration, volume, shuffle, repeat, isLiked,
  analyserNode, onTogglePlay, onSeek, onVolumeChange, onNext, onPrev,
  onToggleShuffle, onToggleRepeat, onToggleLike, onShowQueue, onShowComments
}: PlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barCount = 48;
      const barWidth = canvas.width / barCount - 2;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * canvas.height * 0.9;
        
        const hue = (i / barCount) * 60 + 260; // purple to pink
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        
        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [analyserNode, isPlaying]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const repeatIcon = () => {
    switch (repeat) {
      case 'one': return '🔂';
      case 'all': return '🔁';
      default: return '🔁';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/95 border-t border-white/10">
      {/* Visualizer */}
      <canvas
        ref={canvasRef}
        width={800}
        height={60}
        className="w-full h-10 opacity-60"
      />

      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Progress bar */}
        <div
          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer mb-3 group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            onSeek(pct * duration);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-64">
            <div
              className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
              style={{ background: track.gradient }}
            >
              <span className="text-xl">🎵</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{track.title}</p>
              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-lg transition hidden sm:block ${shuffle ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
              title="Lecture aléatoire (S)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4h4l3 9 3-9h4M4 20h4l3-9 3 9h4"/>
              </svg>
            </button>

            <button onClick={onPrev} className="p-2 text-gray-300 hover:text-white transition" title="Précédent">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/></svg>
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:opacity-90 transition shadow-lg shadow-purple-500/30"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button onClick={onNext} className="p-2 text-gray-300 hover:text-white transition" title="Suivant">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z"/></svg>
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-lg transition hidden sm:block ${repeat !== 'none' ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
              title="Répétition (R)"
            >
              <span className="text-sm">{repeatIcon()}</span>
            </button>
          </div>

          {/* Time */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>{formatDuration(currentTime)}</span>
            <span>/</span>
            <span>{formatDuration(duration)}</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-1 md:flex-none md:w-64 justify-end">
            <button
              onClick={onToggleLike}
              className={`p-2 rounded-lg transition hidden sm:block ${isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'}`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>

            <button onClick={onShowComments} className="p-2 text-gray-400 hover:text-blue-400 transition hidden sm:block">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>

            <button onClick={onShowQueue} className="p-2 text-gray-400 hover:text-purple-400 transition hidden sm:block">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4 6h16M4 10h16M4 14h10M4 18h7"/>
              </svg>
            </button>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
