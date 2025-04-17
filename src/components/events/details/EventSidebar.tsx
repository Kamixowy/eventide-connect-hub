
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SponsorshipOption from '@/components/events/SponsorshipOption';
import UserTypeGuard from '@/components/common/UserTypeGuard';
import { Mail, Share2, MessageSquare } from 'lucide-react';
import { NewCollaborationDialog } from '@/components/collaborations/NewCollaborationDialog';
import SocialMediaLinks from '@/components/common/SocialMediaLinks';
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
  return (
    <div className="space-y-6">
      {/* Sponsorship Options */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Opcje Sponsoringu</h3>
          {sponsorshipOptions && sponsorshipOptions.length > 0 ? (
            <div className="space-y-4">
              {sponsorshipOptions.map((option, index) => (
                <SponsorshipOption key={index} option={option} />
              ))}
              
              {/* Collaboration dialog visible only to sponsors */}
              {isLoggedIn && userType === 'sponsor' && event && (
                <NewCollaborationDialog
                  eventId={event.id}
                  organizationId={event.organization?.id}
                >
                  <Button className="w-full btn-gradient">
                    <MessageSquare size={16} className="mr-2" /> Nawiąż współpracę
                  </Button>
                </NewCollaborationDialog>
              )}

              {/* Login CTA for non-logged in users */}
              {!isLoggedIn && (
                <Link to="/login">
                  <Button className="w-full">
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

      {/* Email Generator for Organization Owners */}
      {isOwner && event && (
        <EmailGenerator event={event} />
      )}

      {/* Contact & Social Media */}
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
