import { Track, Comment } from './types';

const TRACKS_KEY = 'mes-musiques-tracks';
const COMMENTS_KEY = 'mes-musiques-comments';
const LIKED_KEY = 'mes-musiques-liked';

export function getTracks(): Track[] {
  try {
    const data = localStorage.getItem(TRACKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTracks(tracks: Track[]): void {
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
}

export function getComments(): Comment[] {
  try {
    const data = localStorage.getItem(COMMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveComments(comments: Comment[]): void {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function getLikedTracks(): string[] {
  try {
    const data = localStorage.getItem(LIKED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLikedTracks(ids: string[]): void {
  localStorage.setItem(LIKED_KEY, JSON.stringify(ids));
}

export function generateGradient(title: string): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)',
    'linear-gradient(135deg, #667eea 0%, #00d2ff 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
