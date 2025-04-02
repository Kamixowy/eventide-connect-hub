
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryTabProps {
  organization: any;
  isOwner: boolean;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ organization, isOwner }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Galeria</h2>
      
      {organization.gallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organization.gallery.map((image: string, index: number) => (
            <div key={index} className="aspect-square overflow-hidden rounded-md">
              <img 
                src={image} 
                alt={`Galeria ${index + 1}`} 
                className="object-cover w-full h-full hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Galeria jest pusta.
        </p>
      )}
      
      {isOwner && (
        <div className="mt-6">
          <Button>
            <Plus size={16} className="mr-2" /> Dodaj zdjęcia
          </Button>
        </div>
      )}
    </>
  );
};

export default GalleryTab;
