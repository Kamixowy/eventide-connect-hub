
import React from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SponsorshipTooltip from '@/components/events/SponsorshipTooltip';
interface SponsorshipOption {
  id: number | string;
  title: string;
  description: string;
  price?: {
    from: number;
    to?: number;
  };
  benefits: string[];
}
interface EventSidebarProps {
  sponsorshipOptions: SponsorshipOption[];
  isLoggedIn: boolean;
  userType: string | null;
  onContactOrganization: () => void;
  onCopyLink: () => void;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}
const EventSidebar: React.FC<EventSidebarProps> = ({
  sponsorshipOptions,
  isLoggedIn,
  userType,
  onContactOrganization,
  onCopyLink,
  socialMedia
}) => {
  return <>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Możliwości współpracy</CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoggedIn && <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
              <p className="mb-3 font-medium">Zainteresowany sponsorowaniem tego typu wydarzenia?</p>
              <Link to="/logowanie">
                <Button className="btn-gradient w-full">Zaloguj się, aby przesłać ofert
            </Button>
              </Link>
            </div>}

          <div className="space-y-4">
            {sponsorshipOptions && sponsorshipOptions.map((option: SponsorshipOption) => <SponsorshipTooltip key={option.id} benefits={option.benefits || []}>
                <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-help">
                  <h4 className="font-semibold mb-2">{option.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  
                  {isLoggedIn && option.price && <p className="text-sm font-medium">
                      Wycena: {option.price.from}
                      {option.price.to && option.price.to !== option.price.from ? ` - ${option.price.to}` : ''} PLN
                    </p>}
                  
                  {!isLoggedIn && option.price && <p className="text-sm italic text-muted-foreground">
                      Szczegóły cenowe dostępne po zalogowaniu
                    </p>}
                </div>
              </SponsorshipTooltip>)}
          </div>

          {isLoggedIn && userType === 'sponsor' && <Button className="w-full mt-4 btn-gradient" onClick={onContactOrganization}>
              <MessageSquare size={16} className="mr-2" /> Skontaktuj się z organizacją
            </Button>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Udostępnij wydarzenie</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mb-2" onClick={onCopyLink}>
            <LinkIcon size={16} className="mr-2" /> Kopiuj link
          </Button>
          
          {socialMedia && (
            <div className="flex space-x-2 mt-4">
              {socialMedia.facebook && (
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </Button>
              )}
              
              {socialMedia.twitter && (
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  </a>
                </Button>
              )}
              
              {socialMedia.linkedin && (
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                  <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </Button>
              )}
              
              {socialMedia.instagram && (
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M17.5 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.51" x2="17.5" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>;
};
export default EventSidebar;
