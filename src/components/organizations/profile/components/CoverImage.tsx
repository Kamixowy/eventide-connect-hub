
import React from 'react';

interface CoverImageProps {
  coverUrl: string;
  organizationName: string;
}

const CoverImage: React.FC<CoverImageProps> = ({ coverUrl, organizationName }) => {
  return (
    <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
      <img 
        src={coverUrl} 
        alt={organizationName} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default CoverImage;
