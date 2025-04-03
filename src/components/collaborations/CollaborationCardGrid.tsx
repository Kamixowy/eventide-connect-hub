
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CollaborationDialog } from './CollaborationDialog';
import { CollaborationType } from '@/types/collaboration';
import { Link } from 'react-router-dom';

interface CollaborationCardGridProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardGrid = ({ collaboration, userType }: CollaborationCardGridProps) => {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={collaboration.event.image} 
          alt={collaboration.event.title} 
          className="object-cover w-full h-full"
        />
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
          ${collaboration.status === 'Przesłana' ? 'bg-blue-100 text-blue-700' : 
            collaboration.status === 'Negocjacje' ? 'bg-yellow-100 text-yellow-700' : 
            collaboration.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-700'}
        `}>
          {collaboration.status}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{collaboration.event.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{collaboration.event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-ngo" /> 
            <span>Ostatnia aktualizacja: {collaboration.lastUpdated}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <span>Kwota: {collaboration.totalAmount} PLN</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <CollaborationDialog collaboration={collaboration} userType={userType}>
            <Button variant="outline" className="w-full">
              <MessageSquare size={16} className="mr-2" /> Konwersacja
            </Button>
          </CollaborationDialog>
          
          <Link to={`/wspolprace/${collaboration.id}`} className="block w-full">
            <Button variant="default" className="w-full">
              Szczegóły
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
