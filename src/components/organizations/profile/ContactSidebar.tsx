
import React from 'react';
import { Mail, MapPin, Globe, User, Users, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactSidebarProps {
  organization: {
    email: string;
    phone: string;
    location: string;
    website: string;
    foundingYear: number | null;
    followers: number;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({ organization }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Informacje kontaktowe</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="text-ngo mr-3" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a href={`mailto:${organization.email}`} className="font-medium hover:underline">
                {organization.email}
              </a>
            </div>
          </div>
          
          {organization.phone && (
            <div className="flex items-center">
              <User className="text-ngo mr-3" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <a href={`tel:${organization.phone}`} className="font-medium hover:underline">
                  {organization.phone}
                </a>
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <MapPin className="text-ngo mr-3" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Lokalizacja</p>
              <p className="font-medium">{organization.location}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Globe className="text-ngo mr-3" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Strona internetowa</p>
              <a href={organization.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                {organization.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="text-ngo mr-3" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Rok założenia</p>
              <p className="font-medium">{organization.foundingYear || 'Nie podano'}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="text-ngo mr-3" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Obserwujący</p>
              <p className="font-medium">{organization.followers}</p>
            </div>
          </div>
        </div>
        
        {organization.socialMedia && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Media społecznościowe</h4>
            <div className="flex space-x-3">
              {organization.socialMedia.facebook && (
                <a 
                  href={organization.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Facebook size={20} className="text-blue-600" />
                </a>
              )}
              {organization.socialMedia.twitter && (
                <a 
                  href={organization.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Twitter size={20} className="text-blue-400" />
                </a>
              )}
              {organization.socialMedia.linkedin && (
                <a 
                  href={organization.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Linkedin size={20} className="text-blue-700" />
                </a>
              )}
              {organization.socialMedia.instagram && (
                <a 
                  href={organization.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 transition-colors"
                >
                  <Instagram size={20} className="text-pink-600" />
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSidebar;
