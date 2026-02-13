// ============================================
// VIDEO TYPES
// ============================================

export interface Video {
  id: string;
  event_id: string;
  uploader_id: string;
  uploader_name?: string;
  uploader_role: 'client' | 'partner' | 'guest';
  url: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  duration_seconds: number;
  tags: string[];
  recorded_at?: string;
  uploaded_at: string;
  is_public: boolean;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  metadata?: VideoMetadata;
  status: VideoStatus;
  processing_status: VideoProcessingStatus;
  created_at: string;
  updated_at: string;
}

export interface VideoMetadata {
  width: number;
  height: number;
  size_bytes: number;
  format: string;
  codec?: string;
  bitrate?: number;
  framerate?: number;
}

export enum VideoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export enum VideoProcessingStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed'
}

export interface VideoComment {
  id: string;
  video_id: string;
  user_id: string;
  user_name: string;
  content: string;
  timestamp_seconds?: number;
  created_at: string;
}

export interface VideoView {
  id: string;
  video_id: string;
  user_id: string;
  watched_duration_seconds: number;
  created_at: string;
}

// ============================================
// DTOs
// ============================================

export interface CreateVideoDTO {
  event_id: string;
  url: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  duration_seconds: number;
  tags?: string[];
  recorded_at?: string;
  is_public?: boolean;
  metadata?: VideoMetadata;
}

export interface UpdateVideoDTO {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  tags?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  status?: VideoStatus;
}

export interface CreateVideoCommentDTO {
  video_id: string;
  content: string;
  timestamp_seconds?: number;
}

export interface RecordVideoViewDTO {
  video_id: string;
  watched_duration_seconds: number;
}

// ============================================
// LIST PARAMS
// ============================================

export interface VideoListParams {
  event_id?: string;
  uploader_id?: string;
  status?: VideoStatus;
  processing_status?: VideoProcessingStatus;
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
  search?: string;
  min_duration?: number;
  max_duration?: number;
  sort_by?: 'created_at' | 'views_count' | 'likes_count' | 'duration_seconds';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ============================================
// STATS
// ============================================

export interface VideoStats {
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  featured_count: number;
  total_duration_seconds: number;
  videos_by_status: Record<VideoStatus, number>;
  videos_by_processing_status: Record<VideoProcessingStatus, number>;
  storage_used_mb: number;
  average_views_per_video: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getVideoStatusLabel(status: VideoStatus): string {
  const labels: Record<VideoStatus, string> = {
    [VideoStatus.PENDING]: 'En attente',
    [VideoStatus.APPROVED]: 'Approuvée',
    [VideoStatus.REJECTED]: 'Rejetée',
    [VideoStatus.ARCHIVED]: 'Archivée'
  };
  return labels[status] || status;
}

export function getProcessingStatusLabel(status: VideoProcessingStatus): string {
  const labels: Record<VideoProcessingStatus, string> = {
    [VideoProcessingStatus.UPLOADING]: 'Téléchargement...',
    [VideoProcessingStatus.PROCESSING]: 'Traitement...',
    [VideoProcessingStatus.READY]: 'Prêt',
    [VideoProcessingStatus.FAILED]: 'Échec'
  };
  return labels[status] || status;
}

export function isVideoReady(video: Video): boolean {
  return video.processing_status === VideoProcessingStatus.READY 
    && video.status === VideoStatus.APPROVED;
}

export function canPlayVideo(video: Video): boolean {
  return video.processing_status === VideoProcessingStatus.READY;
}

export function formatVideoDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = Math.floor(durationSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatVideoSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  if (sizeBytes < 1024 * 1024 * 1024) return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function getVideoResolution(video: Video): string {
  if (!video.metadata) return 'unknown';
  const { width, height } = video.metadata;
  
  if (height >= 2160) return '4K';
  if (height >= 1080) return '1080p (Full HD)';
  if (height >= 720) return '720p (HD)';
  if (height >= 480) return '480p (SD)';
  return `${width}x${height}`;
}

export function validateVideoUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 500 * 1024 * 1024; // 500 MB
  const allowedFormats = ['video/mp4', 'video/webm', 'video/quicktime'];

  if (!allowedFormats.includes(file.type)) {
    return { valid: false, error: 'Format non supporté. Utilisez MP4, WebM ou MOV.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Fichier trop volumineux. Maximum 500 MB.' };
  }

  return { valid: true };
}

export function calculateCompletionPercentage(video: Video, watchedSeconds: number): number {
  if (video.duration_seconds === 0) return 0;
  return Math.min(100, Math.round((watchedSeconds / video.duration_seconds) * 100));
}

export function filterVideosByDuration(
  videos: Video[],
  minSeconds: number,
  maxSeconds: number
): Video[] {
  return videos.filter(
    video => video.duration_seconds >= minSeconds && video.duration_seconds <= maxSeconds
  );
}

export function groupVideosByDate(videos: Video[]): Record<string, Video[]> {
  return videos.reduce((acc, video) => {
    const date = new Date(video.uploaded_at).toLocaleDateString('fr-FR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(video);
    return acc;
  }, {} as Record<string, Video[]>);
}
