export type AudioStatus = 'Processing' | 'Published' | 'Archived';

export interface AudioFile {
  id: string;
  title: string;
  description?: string;
  artist?: string;
  category?: string;
  fileUrl: string;
  coverUrl?: string;
  duration?: number;
  status: AudioStatus;
  createdAt: Date;
}

export const AUDIO_STATUSES: AudioStatus[] = [
  'Processing',
  'Published',
  'Archived'
];

export const AUDIO_CATEGORIES = [
  'Musique',
  'Podcast',
  'Voix Off',
  'Sound Design',
  'Jingle',
  'Autre'
];
