
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { CollaborationDialog } from './CollaborationDialog';
import { CollaborationType } from '@/types/collaboration';

interface CollaborationCardListProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardList = ({ collaboration, userType }: CollaborationCardListProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/4 overflow-hidden">
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
        <CardContent className="p-4 md:p-6 md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">{collaboration.event.title}</h3>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage 
                    src={userType === 'organization' ? collaboration.sponsor.avatar : collaboration.event.image} 
                    alt={userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization} 
                  />
                  <AvatarFallback>
                    {userType === 'organization' 
                      ? collaboration.sponsor.name.substring(0, 2) 
                      : collaboration.event.organization.substring(0, 2)
                    }
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground text-sm">
                  {userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <p className="font-medium mb-1">Kwota: {collaboration.totalAmount} PLN</p>
              <p className="text-sm text-muted-foreground mb-2">Ostatnia aktualizacja: {collaboration.lastUpdated}</p>
              <CollaborationDialog collaboration={collaboration} userType={userType}>
                <Button variant="outline">
                  <MessageSquare size={16} className="mr-2" /> Konwersacja
                </Button>
              </CollaborationDialog>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-ngo" /> 
              <span>{collaboration.event.date}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 text-ngo" /> 
              <span>Utworzono: {collaboration.createdAt}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Opcje współpracy:</p>
            <div className="flex flex-wrap gap-2">
              {collaboration.sponsorshipOptions.map((option, index) => (
                <Badge key={index} variant="outline">
                  {option.title}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
