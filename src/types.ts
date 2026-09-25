export interface Track {
  id: string;
  title: string;
  artist: string;
  fileName: string;
  fileSize: number;
  duration: number;
  audioData: string; // base64 encoded
  likes: number;
  plays: number;
  downloads: number;
  createdAt: number;
  gradient: string;
}

export interface Comment {
  id: string;
  trackId: string;
  author: string;
  text: string;
  createdAt: number;
}

export type SortOption = 'newest' | 'oldest' | 'most-liked' | 'most-played' | 'a-z';
export type RepeatMode = 'none' | 'all' | 'one';
