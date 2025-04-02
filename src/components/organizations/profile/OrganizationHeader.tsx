
import React from 'react';
import { Heart, MessageSquare, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface OrganizationHeaderProps {
  organization: any;
  isLoggedIn: boolean;
  isOwner: boolean;
  following: boolean;
  setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  handleContact: () => void;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  organization,
  isLoggedIn,
  isOwner,
  following,
  setFollowing,
  handleContact
}) => {
  const { toast } = useToast();

  const handleFollow = () => {
    setFollowing(!following);
    toast({
      title: following ? "Przestałeś obserwować" : "Obserwujesz organizację",
      description: following 
        ? "Nie będziesz już otrzymywać powiadomień o nowościach" 
        : "Będziesz otrzymywać powiadomienia o nowych wydarzeniach",
    });
  };

  return (
    <>
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        <img 
          src={organization.cover} 
          alt={organization.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row -mt-16 md:-mt-24 mb-8 items-start">
          <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-white">
            <AvatarImage src={organization.logo} alt={organization.name} />
            <AvatarFallback className="text-3xl">{organization.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-4 md:mt-20 md:ml-6 flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end">
              <div>
                <Badge className="mb-2 bg-ngo text-white">
                  {organization.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold">{organization.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {organization.location}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-3">
                {isLoggedIn && !isOwner && (
                  <Button 
                    variant={following ? "default" : "outline"} 
                    onClick={handleFollow}
                    className={following ? "bg-ngo hover:bg-ngo/90" : ""}
                  >
                    {following ? (
                      <>
                        <Heart size={16} className="mr-2 fill-current" /> Obserwujesz
                      </>
                    ) : (
                      <>
                        <Heart size={16} className="mr-2" /> Obserwuj
                      </>
                    )}
                  </Button>
                )}
                
                {isLoggedIn && !isOwner && (
                  <Button 
                    variant="outline" 
                    onClick={handleContact}
                  >
                    <MessageSquare size={16} className="mr-2" /> Kontakt
                  </Button>
                )}
                
                {isOwner && (
                  <Button>
                    <Edit size={16} className="mr-2" /> Edytuj profil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationHeader;
