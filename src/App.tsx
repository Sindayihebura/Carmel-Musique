import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, Comment, SortOption, RepeatMode } from './types';
import { getTracks, saveTracks, getComments, saveComments, getLikedTracks, saveLikedTracks, generateGradient, formatDuration } from './store';
import { Header } from './components/Header';
import { TrackCard } from './components/TrackCard';
import { Player } from './components/Player';
import { UploadModal } from './components/UploadModal';
import { CommentsPanel } from './components/CommentsPanel';
import { QueuePanel } from './components/QueuePanel';
import { Stats } from './components/Stats';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(getTracks());
  const [comments, setComments] = useState<Comment[]>(getComments());
  const [likedIds, setLikedIds] = useState<string[]>(getLikedTracks());
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [showUpload, setShowUpload] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('none');
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Setup analyser when track changes
  const setupAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      setAnalyserNode(analyser);
    } catch (e) {
      // Source already connected
    }
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  }, [repeat, shuffle, tracks]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    setCurrentTrack(track);
    audioRef.current.src = track.audioData;
    audioRef.current.play();
    setIsPlaying(true);
    setupAnalyser();
    
    // Increment plays
    const updated = tracks.map(t => t.id === track.id ? { ...t, plays: t.plays + 1 } : t);
    setTracks(updated);
    saveTracks(updated);
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const filtered = getFilteredTracks();
    if (filtered.length === 0) return;
    
    const idx = filtered.findIndex(t => t.id === currentTrack.id);
    let nextIdx: number;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * filtered.length);
    } else {
      nextIdx = (idx + 1) % filtered.length;
    }
    playTrack(filtered[nextIdx]);
  };

  const playPrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const filtered = getFilteredTracks();
    if (filtered.length === 0) return;
    
    const idx = filtered.findIndex(t => t.id === currentTrack.id);
    const prevIdx = idx <= 0 ? filtered.length - 1 : idx - 1;
    playTrack(filtered[prevIdx]);
  };

  const toggleLike = (trackId: string) => {
    const newLiked = likedIds.includes(trackId)
      ? likedIds.filter(id => id !== trackId)
      : [...likedIds, trackId];
    
    setLikedIds(newLiked);
    saveLikedTracks(newLiked);

    const updated = tracks.map(t => {
      if (t.id === trackId) {
        const isLiked = likedIds.includes(trackId);
        return { ...t, likes: isLiked ? t.likes - 1 : t.likes + 1 };
      }
      return t;
    });
    setTracks(updated);
    saveTracks(updated);
  };

  const addTrack = (title: string, artist: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const audioData = reader.result as string;
      const audio = new Audio(audioData);
      audio.addEventListener('loadedmetadata', () => {
        const newTrack: Track = {
          id: crypto.randomUUID(),
          title,
          artist,
          fileName: file.name,
          fileSize: file.size,
          duration: audio.duration,
          audioData,
          likes: 0,
          plays: 0,
          downloads: 0,
          createdAt: Date.now(),
          gradient: generateGradient(title),
        };
        const updated = [newTrack, ...tracks];
        setTracks(updated);
        saveTracks(updated);
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteTrack = (trackId: string) => {
    const updated = tracks.filter(t => t.id !== trackId);
    setTracks(updated);
    saveTracks(updated);
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const downloadTrack = (track: Track) => {
    const a = document.createElement('a');
    a.href = track.audioData;
    a.download = track.fileName;
    a.click();
    
    const updated = tracks.map(t => t.id === track.id ? { ...t, downloads: t.downloads + 1 } : t);
    setTracks(updated);
    saveTracks(updated);
  };

  const addComment = (trackId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      trackId,
      author,
      text,
      createdAt: Date.now(),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    saveComments(updated);
  };

  const getFilteredTracks = (): Track[] => {
    let filtered = [...tracks];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'newest': filtered.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'oldest': filtered.sort((a, b) => a.createdAt - b.createdAt); break;
      case 'most-liked': filtered.sort((a, b) => b.likes - a.likes); break;
      case 'most-played': filtered.sort((a, b) => b.plays - a.plays); break;
      case 'a-z': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return filtered;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) playNext();
          else if (audioRef.current) seek(Math.min(audioRef.current.currentTime + 5, duration));
          break;
        case 'ArrowLeft':
          if (e.shiftKey) playPrev();
          else if (audioRef.current) seek(Math.max(audioRef.current.currentTime - 5, 0));
          break;
        case 'KeyS':
          setShuffle(s => !s);
          break;
        case 'KeyR':
          setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none');
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentTrack, isPlaying, duration, tracks, shuffle]);

  const filteredTracks = getFilteredTracks();
  const totalPlays = tracks.reduce((sum, t) => sum + t.plays, 0);
  const totalLikes = tracks.reduce((sum, t) => sum + t.likes, 0);
  const totalDownloads = tracks.reduce((sum, t) => sum + t.downloads, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <Header
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        onUpload={() => setShowUpload(true)}
        trackCount={tracks.length}
      />

      <Stats
        trackCount={tracks.length}
        totalPlays={totalPlays}
        totalLikes={totalLikes}
        totalDownloads={totalDownloads}
      />

      {/* Track Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-48">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold mb-2">
              {tracks.length === 0 ? 'Aucun morceau' : 'Aucun résultat'}
            </h2>
            <p className="text-gray-400">
              {tracks.length === 0 
                ? 'Commencez par ajouter vos morceaux préférés !'
                : 'Essayez une autre recherche'}
            </p>
            {tracks.length === 0 && (
              <button
                onClick={() => setShowUpload(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:opacity-90 transition"
              >
                Ajouter un morceau
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTracks.map(track => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                isLiked={likedIds.includes(track.id)}
                onPlay={() => playTrack(track)}
                onLike={() => toggleLike(track.id)}
                onDelete={() => deleteTrack(track.id)}
                onDownload={() => downloadTrack(track)}
                onComment={() => { setCurrentTrack(track); setShowComments(true); }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Player */}
      {currentTrack && (
        <Player
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          shuffle={shuffle}
          repeat={repeat}
          isLiked={likedIds.includes(currentTrack.id)}
          analyserNode={analyserNode}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onVolumeChange={setVolume}
          onNext={playNext}
          onPrev={playPrev}
          onToggleShuffle={() => setShuffle(s => !s)}
          onToggleRepeat={() => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')}
          onToggleLike={() => toggleLike(currentTrack.id)}
          onShowQueue={() => setShowQueue(true)}
          onShowComments={() => setShowComments(true)}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onAdd={addTrack}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Comments Panel */}
      {showComments && currentTrack && (
        <CommentsPanel
          track={currentTrack}
          comments={comments.filter(c => c.trackId === currentTrack.id)}
          onAddComment={addComment}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Queue Panel */}
      {showQueue && (
        <QueuePanel
          tracks={filteredTracks}
          currentTrack={currentTrack}
          onSelect={playTrack}
          onClose={() => setShowQueue(false)}
        />
      )}
    </div>
  );
}
