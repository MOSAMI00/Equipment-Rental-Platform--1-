import { useState } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { Thumbnails } from './Thumbnails';

interface GalleryProps {
  images: string[];
  status: string;
  discount?: number;
}

export function Gallery({ images, status, discount }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <ImageDisplay 
        images={images} 
        currentImageIndex={currentImageIndex} 
        setCurrentImageIndex={setCurrentImageIndex} 
        status={status} 
        discount={discount} 
      />
      <Thumbnails 
        images={images} 
        currentImageIndex={currentImageIndex} 
        setCurrentImageIndex={setCurrentImageIndex} 
      />
    </div>
  );
}

