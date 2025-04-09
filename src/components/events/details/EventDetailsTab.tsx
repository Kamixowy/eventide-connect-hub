
import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventDetailsTabProps {
  description: string;
  audience?: string[];
  category?: string;
  tags?: string[];
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
  };
}

const EventDetailsTab: React.FC<EventDetailsTabProps> = ({
  description,
  audience,
  category,
  tags,
  socialMedia
}) => {
  return (
    <>
      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-bold mb-4">Opis wydarzenia</h2>
        {description && description.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
        ))}
      </div>

      {audience && audience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Odbiorcy</h3>
          <div className="flex flex-wrap gap-2">
            {audience.map((audience: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {audience}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {category && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Kategoria</h3>
          <Badge className="bg-ngo text-white px-3 py-1 text-sm">
            {category}
          </Badge>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Tagi</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-gray-100">
                <Tag size={14} className="mr-1" /> {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {socialMedia && (socialMedia.facebook || socialMedia.linkedin) && (
        <div>
          <h3 className="text-xl font-bold mb-4">Media społecznościowe</h3>
          <div className="flex space-x-4">
            {socialMedia.facebook && (
              <a 
                href={socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-ngo hover:underline"
              >
                <svg className="mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg> Facebook
              </a>
            )}
            {socialMedia.linkedin && (
              <a 
                href={socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-ngo hover:underline"
              >
                <svg className="mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg> LinkedIn
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsTab;
