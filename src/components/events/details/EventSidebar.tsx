import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SponsorshipOption from '@/components/events/SponsorshipOption';
import { Mail, Share2, MessageSquare } from 'lucide-react';
import NewCollaborationDialog from '@/components/collaborations/NewCollaborationDialog';
import SocialMediaLinks from '@/components/common/SocialMediaLinks';
import { useAuth } from '@/contexts/AuthContext';
import EmailGenerator from './EmailGenerator';

interface EventSidebarProps {
  sponsorshipOptions: any[];
  isLoggedIn: boolean;
  userType: string | null;
  onContactOrganization: () => void;
  onCopyLink: () => void;
  socialMedia?: Record<string, string>;
  event?: any;
  isOwner?: boolean;
}

const EventSidebar: React.FC<EventSidebarProps> = ({
  sponsorshipOptions,
  isLoggedIn,
  userType,
  onContactOrganization,
  onCopyLink,
  socialMedia,
  event,
  isOwner = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const handleOptionSelect = (optionId: string) => {
    if (!isLoggedIn || userType !== 'sponsor') return;
    
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  
  const handleCollaborationStart = () => {
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedOptions([]);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Opcje Sponsoringu</h3>
          {sponsorshipOptions && sponsorshipOptions.length > 0 ? (
            <div className="space-y-4">
              {sponsorshipOptions.map((option, index) => (
                <SponsorshipOption 
                  key={index} 
                  option={option} 
                  isSelected={selectedOptions.includes(option.id)}
                  onSelect={isLoggedIn && userType === 'sponsor' ? () => handleOptionSelect(option.id) : undefined}
                  showPrice={isLoggedIn}
                />
              ))}
              
              {isLoggedIn && userType === 'sponsor' && event && (
                <div className="mt-4">
                  <NewCollaborationDialog
                    eventId={event.id}
                    organizationId={event.organization?.id}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                  >
                    <Button className="w-full btn-gradient" onClick={handleCollaborationStart}>
                      <MessageSquare size={16} className="mr-2" /> 
                      {selectedOptions.length > 0 
                        ? `Wyślij propozycję współpracy (${selectedOptions.length})` 
                        : 'Nawiąż współpracę'}
                    </Button>
                  </NewCollaborationDialog>
                </div>
              )}

              {!isLoggedIn && (
                <Link to="/logowanie">
                  <Button className="w-full mt-4">
                    Zaloguj się, aby nawiązać współpracę
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Brak dostępnych opcji sponsoringu dla tego wydarzenia.
            </p>
          )}
        </CardContent>
      </Card>

      {isOwner && event && (
        <EmailGenerator event={event} />
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Kontakt</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onContactOrganization}
            >
              <Mail size={16} className="mr-2" /> Kontakt z organizacją
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onCopyLink}
            >
              <Share2 size={16} className="mr-2" /> Udostępnij wydarzenie
            </Button>
            
            {socialMedia && Object.keys(socialMedia).length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Social media:
                </p>
                <SocialMediaLinks socialMedia={socialMedia} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSidebar;
