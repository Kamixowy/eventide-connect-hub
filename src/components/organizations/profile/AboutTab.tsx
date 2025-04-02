
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AboutTabProps {
  organization: any;
}

const AboutTab: React.FC<AboutTabProps> = ({ organization }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">O nas</h2>
      
      <p className="text-muted-foreground mb-8 whitespace-pre-line">
        {organization.description}
      </p>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Działalność</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="text-foreground">
            {organization.category}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <CalendarIcon size={16} className="mr-2" />
          Rok założenia: {organization.foundationYear}
        </div>
      </div>
      
      {organization.achievements && organization.achievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Osiągnięcia</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {organization.achievements.map((achievement: string, index: number) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AboutTab;
