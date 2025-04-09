import React from 'react';
import { Heart, MessageSquare, Edit, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface OrganizationHeaderProps {
  organization: {
    name: string;
    logo: string;
    cover: string;
    location: string;
    category: string;
    followers: number;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
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

  const renderSocialMediaButtons = () => {
    const socialLinks = [];
    
    if (organization.socialMedia?.facebook) {
      socialLinks.push(
        <a 
          key="facebook" 
          href={organization.socialMedia.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      );
    }
    
    if (organization.socialMedia?.twitter) {
      socialLinks.push(
        <a 
          key="twitter" 
          href={organization.socialMedia.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sky-500 hover:text-sky-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        </a>
      );
    }
    
    if (organization.socialMedia?.linkedin) {
      socialLinks.push(
        <a 
          key="linkedin" 
          href={organization.socialMedia.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
      );
    }
    
    if (organization.socialMedia?.instagram) {
      socialLinks.push(
        <a 
          key="instagram" 
          href={organization.socialMedia.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M17.5 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.51" x2="17.5" y1="6.5" y2="6.5"/></svg>
        </a>
      );
    }
    
    if (socialLinks.length === 0) {
      return null;
    }
    
    return (
      <div className="flex gap-4 mt-2">
        {socialLinks}
      </div>
    );
  };

  const getUserType = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('sb-user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData?.user_metadata?.userType || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const userType = getUserType();
  const isOrganizationUser = userType === 'organization';

  return (
    <>
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        <img 
          src={organization.cover || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
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
                
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  {organization.followers || 0} obserwujących
                </div>
                
                {renderSocialMediaButtons()}
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-3">
                {isLoggedIn && !isOrganizationUser && !isOwner && (
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
                
                {isLoggedIn && !isOrganizationUser && !isOwner && (
                  <Button 
                    variant="outline" 
                    onClick={handleContact}
                  >
                    <MessageSquare size={16} className="mr-2" /> Kontakt
                  </Button>
                )}
                
                {isOwner && (
                  <Link to="/profil">
                    <Button>
                      <Edit size={16} className="mr-2" /> Edytuj profil
                    </Button>
                  </Link>
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
