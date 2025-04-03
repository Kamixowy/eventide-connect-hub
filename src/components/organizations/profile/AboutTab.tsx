
import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Check, Clock } from 'lucide-react';

interface AboutTabProps {
  organization: {
    description: string;
    achievements?: string[];
    gallery?: string[];
    foundingYear?: number | null;
    foundingDate?: Date | null;
  };
}

const AboutTab: React.FC<AboutTabProps> = ({ organization }) => {
  // Remove the founding date section as it's already in the ContactSidebar
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">O nas</h3>
        <div className="prose max-w-none">
          {organization.description.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {organization.achievements && organization.achievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Osiągnięcia</h3>
          <div className="space-y-3">
            {organization.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start">
                <Check className="h-5 w-5 text-ngo mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed the founding date section */}
      
      {organization.gallery && organization.gallery.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Galeria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {organization.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Galeria ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;
