
import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialMediaLinksProps {
  socialMedia: Record<string, string>;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialMedia }) => {
  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook size={20} />,
    instagram: <Instagram size={20} />,
    twitter: <Twitter size={20} />,
    linkedin: <Linkedin size={20} />,
    youtube: <Youtube size={20} />,
    website: <Globe size={20} />,
  };

  // Filter out empty social media links
  const validSocialMedia = Object.entries(socialMedia)
    .filter(([_, url]) => url && url.trim() !== '')
    .reduce((acc: Record<string, string>, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(validSocialMedia).map(([platform, url]) => {
        // Ensure URL has protocol
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        
        return (
          <Button
            key={platform}
            variant="outline"
            size="icon"
            className="h-9 w-9"
            asChild
          >
            <a 
              href={fullUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              {socialIcons[platform] || <ExternalLink size={20} />}
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
