import { useState } from 'react';
import { Track, Comment } from '../types';

interface CommentsPanelProps {
  track: Track;
  comments: Comment[];
  onAddComment: (trackId: string, author: string, text: string) => void;
  onClose: () => void;
}

export function CommentsPanel({ track, comments, onAddComment, onClose }: CommentsPanelProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    onAddComment(track.id, author.trim(), text.trim());
    setText('');
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: track.gradient }}
            >
              <span className="text-lg">🎵</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">{track.title}</h3>
              <p className="text-xs text-gray-400">{comments.length} commentaire{comments.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm">Aucun commentaire pour le moment</p>
              <p className="text-xs mt-1">Soyez le premier à commenter !</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {comment.author[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{comment.author}</span>
                  <span className="text-xs text-gray-500 ml-auto">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-300 pl-8">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 space-y-3">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Votre commentaire..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={!author.trim() || !text.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
