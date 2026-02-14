import React, { useState, useEffect } from 'react';
import { Play, Plus, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  uploaderName: string;
  duration: string;
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    timecode?: string;
  }>;
}

const VideoGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [comment, setComment] = useState('');
  const eventId = 'demo-event-id';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/videos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setVideos(data.data);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!selectedVideo || !comment.trim()) return;
    try {
      const response = await fetch(`/api/videos/${selectedVideo.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          authorEmail: 'user@example.com',
          authorName: 'Current User',
          content: comment
        })
      });
      if (response.ok) {
        toast.success('Comment added');
        setComment('');
        fetchVideos();
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Video Gallery</h1>
          <Button><Plus className="w-4 h-4 mr-2" />Upload Video</Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="p-4 cursor-pointer hover:shadow-lg transition" onClick={() => setSelectedVideo(video)}>
                <div className="relative">
                  <img src={video.thumbnailUrl || '/placeholder-video.png'} alt={video.title} className="w-full h-40 object-cover rounded" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80" />
                  </div>
                </div>
                <h3 className="font-semibold mt-2">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.uploaderName} • {video.duration}</p>
                <p className="text-sm text-gray-500 mt-1">{video.comments.length} comments</p>
              </Card>
            ))}
          </div>
        )}

        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setSelectedVideo(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full p-6" onClick={(e) => e.stopPropagation()}>
              <video src={selectedVideo.url} controls className="w-full rounded" />
              <h2 className="text-2xl font-bold mt-4">{selectedVideo.title}</h2>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Comments ({selectedVideo.comments.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                  {selectedVideo.comments.map((c) => (
                    <div key={c.id} className="bg-gray-100 p-2 rounded">
                      <p className="font-medium text-sm">{c.authorName}</p>
                      <p className="text-sm">{c.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
                  <Button onClick={addComment}><MessageCircle className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGalleryPage;
