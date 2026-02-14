import React, { useState, useEffect } from 'react';
import { Plus, Heart, Download, Trash2, Filter, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'react-toastify';

interface Photo {
  id: string;
  eventId: string;
  url: string;
  thumbnailUrl?: string;
  uploaderEmail: string;
  uploaderName: string;
  type: 'PRO' | 'GUEST';
  category?: string;
  caption?: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  createdAt: string;
}

const PhotoGalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PRO' | 'GUEST'>('ALL');
  const [uploading, setUploading] = useState(false);
  const eventId = 'demo-event-id'; // Replace with actual event ID from context/route

  useEffect(() => {
    fetchPhotos();
  }, [filter]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const queryParams = filter !== 'ALL' ? `?type=${filter}` : '';
      const response = await fetch(`/api/events/${eventId}/photos${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPhotos(data.data);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      // First, upload to Cloudinary (placeholder - needs real Cloudinary integration)
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock upload - replace with actual Cloudinary upload
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadResponse.json();

      // Then save to database
      const response = await fetch(`/api/events/${eventId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          url: uploadData.url,
          thumbnailUrl: uploadData.thumbnailUrl,
          uploaderEmail: 'user@example.com', // Get from auth context
          uploaderName: 'Current User',
          type: 'GUEST',
          caption: '',
          tags: []
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Photo uploaded successfully!');
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userEmail: 'user@example.com' // Get from auth context
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Photo deleted successfully');
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="text-gray-600 mt-1">{photos.length} photos</p>
          </div>
          <label htmlFor="photo-upload">
            <Button disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'PRO', 'GUEST'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f as any)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {f}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="group relative overflow-hidden">
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.caption || 'Photo'}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white"
                    onClick={() => handleLike(photo.id)}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="ml-1">{photo.likes}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white"
                    onClick={() => window.open(photo.url, '_blank')}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                {photo.caption && (
                  <div className="p-2 bg-white">
                    <p className="text-sm text-gray-700 truncate">{photo.caption}</p>
                    <p className="text-xs text-gray-500">{photo.uploaderName}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos yet. Upload your first photo!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryPage;
