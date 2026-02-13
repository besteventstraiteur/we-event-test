// ============================================
// PHOTO TYPES
// ============================================

export interface Photo {
  id: string;
  event_id: string;
  uploader_id: string;
  uploader_name?: string;
  uploader_role: 'client' | 'partner' | 'guest';
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  tags: string[];
  taken_at?: string;
  uploaded_at: string;
  is_public: boolean;
  is_featured: boolean;
  likes_count: number;
  comments_count: number;
  album_id?: string;
  metadata?: PhotoMetadata;
  status: PhotoStatus;
  created_at: string;
  updated_at: string;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  size_bytes: number;
  format: string;
  camera?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export enum PhotoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export interface PhotoAlbum {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  cover_photo_url?: string;
  photos_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoComment {
  id: string;
  photo_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface PhotoLike {
  id: string;
  photo_id: string;
  user_id: string;
  created_at: string;
}

// ============================================
// DTOs
// ============================================

export interface CreatePhotoDTO {
  event_id: string;
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  tags?: string[];
  taken_at?: string;
  is_public?: boolean;
  album_id?: string;
  metadata?: PhotoMetadata;
}

export interface UpdatePhotoDTO {
  title?: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  album_id?: string;
  status?: PhotoStatus;
}

export interface CreateAlbumDTO {
  event_id: string;
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateAlbumDTO {
  name?: string;
  description?: string;
  cover_photo_url?: string;
  is_public?: boolean;
}

export interface CreatePhotoCommentDTO {
  photo_id: string;
  content: string;
}

// ============================================
// LIST PARAMS
// ============================================

export interface PhotoListParams {
  event_id?: string;
  album_id?: string;
  uploader_id?: string;
  status?: PhotoStatus;
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
  search?: string;
  sort_by?: 'created_at' | 'uploaded_at' | 'likes_count' | 'taken_at';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AlbumListParams {
  event_id?: string;
  created_by?: string;
  is_public?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// STATS
// ============================================

export interface PhotoStats {
  total_photos: number;
  total_albums: number;
  total_likes: number;
  total_comments: number;
  featured_count: number;
  photos_by_status: Record<PhotoStatus, number>;
  photos_by_uploader_role: Record<string, number>;
  storage_used_mb: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPhotoStatusLabel(status: PhotoStatus): string {
  const labels: Record<PhotoStatus, string> = {
    [PhotoStatus.PENDING]: 'En attente',
    [PhotoStatus.APPROVED]: 'Approuvée',
    [PhotoStatus.REJECTED]: 'Rejetée',
    [PhotoStatus.ARCHIVED]: 'Archivée'
  };
  return labels[status] || status;
}

export function isPhotoApproved(photo: Photo): boolean {
  return photo.status === PhotoStatus.APPROVED;
}

export function canEditPhoto(photo: Photo, currentUserId: string): boolean {
  return photo.uploader_id === currentUserId;
}

export function formatPhotoSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getPhotoAspectRatio(photo: Photo): string {
  if (!photo.metadata) return 'unknown';
  const { width, height } = photo.metadata;
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function validatePhotoUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedFormats.includes(file.type)) {
    return { valid: false, error: 'Format non supporté. Utilisez JPEG, PNG ou WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Fichier trop volumineux. Maximum 10 MB.' };
  }

  return { valid: true };
}

export function filterPhotosByTags(photos: Photo[], tags: string[]): Photo[] {
  if (!tags.length) return photos;
  return photos.filter(photo => 
    tags.some(tag => photo.tags.includes(tag))
  );
}

export function groupPhotosByDate(photos: Photo[]): Record<string, Photo[]> {
  return photos.reduce((acc, photo) => {
    const date = new Date(photo.uploaded_at).toLocaleDateString('fr-FR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);
}

export function getPhotoUrl(photo: Photo, useThumbnail = false): string {
  return useThumbnail && photo.thumbnail_url ? photo.thumbnail_url : photo.url;
}
