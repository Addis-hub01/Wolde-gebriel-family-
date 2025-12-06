import React, { useState } from 'react';
import { Photo, User } from '../types';
import { Upload, Tag, Calendar, User as UserIcon } from 'lucide-react';

interface GalleryProps {
  photos: Photo[];
  currentUser: User;
  onUpload: (photo: Photo) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, currentUser, onUpload }) => {
  const [filter, setFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);

  const albums = ['All', ...Array.from(new Set(photos.map(p => p.album).filter(Boolean)))];
  
  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter(p => p.album === filter);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload process
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: `p-${Date.now()}`,
          url: reader.result as string,
          caption: 'New Upload',
          uploadedBy: currentUser.id,
          dateUploaded: new Date().toISOString().split('T')[0],
          taggedMemberIds: [],
          album: 'Recent'
        };
        onUpload(newPhoto);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Family Gallery</h2>
        
        <div className="flex items-center gap-2">
            {isUploading ? (
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-sm text-slate-500">Processing...</span>
                </div>
            ) : (
                <label className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    <Upload size={18} />
                    <span>Upload Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            )}
        </div>
      </div>

      {/* Albums / Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {albums.map(album => (
          <button
            key={album}
            onClick={() => setFilter(album as string)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === album 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img 
              src={photo.url} 
              alt={photo.caption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white font-medium text-sm truncate">{photo.caption}</p>
              <div className="flex items-center gap-2 text-slate-300 text-xs mt-1">
                <Calendar size={12} />
                <span>{photo.dateUploaded}</span>
                {photo.taggedMemberIds.length > 0 && (
                    <>
                        <Tag size={12} className="ml-2"/>
                        <span>{photo.taggedMemberIds.length}</span>
                    </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
