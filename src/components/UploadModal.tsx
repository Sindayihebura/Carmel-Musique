import { useState, useRef } from 'react';

interface UploadModalProps {
  onAdd: (title: string, artist: string, file: File) => void;
  onClose: () => void;
}

export function UploadModal({ onAdd, onClose }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('audio/')) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !file) return;
    onAdd(title, artist, file);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎶</span>
          Ajouter un morceau
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              dragOver ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50'
            }`}
          >
            {file ? (
              <div>
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📁</p>
                <p className="text-sm text-gray-300">Glissez un fichier audio ici</p>
                <p className="text-xs text-gray-500 mt-1">ou cliquez pour sélectionner</p>
                <p className="text-xs text-gray-500 mt-2">MP3, WAV, OGG, M4A, FLAC, AAC, WebM</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nom du morceau"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Artiste</label>
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="Nom de l'artiste"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title || !artist || !file}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
