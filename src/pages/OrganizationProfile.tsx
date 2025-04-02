
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import OrganizationHeader from '@/components/organizations/profile/OrganizationHeader';
import AboutTab from '@/components/organizations/profile/AboutTab';
import EventsTab from '@/components/organizations/profile/EventsTab';
import GalleryTab from '@/components/organizations/profile/GalleryTab';
import ContactSidebar from '@/components/organizations/profile/ContactSidebar';
import SponsorshipCard from '@/components/organizations/profile/SponsorshipCard';

// Example organization data
const organizationData = {
  id: 101,
  name: 'Fundacja Szczęśliwe Dzieciństwo',
  description: 'Nasza fundacja wspiera dzieci z domów dziecka i rodzin zastępczych. Organizujemy wydarzenia, wycieczki i zapewniamy materiały edukacyjne. Celem naszej działalności jest zapewnienie dzieciom pozbawionym opieki rodzicielskiej szansy na lepszą przyszłość.\n\nOd 2010 roku zrealizowaliśmy ponad 50 projektów, które objęły swoim wsparciem ponad 1000 dzieci. Naszym priorytetem jest edukacja, rozwój talentów oraz wsparcie psychologiczne.',
  logo: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  cover: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  location: 'Warszawa, mazowieckie',
  email: 'kontakt@fundacja-dzieci.pl',
  phone: '+48 123 456 789',
  website: 'https://www.fundacja-dzieci.pl',
  socialMedia: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  },
  category: 'Pomoc dzieciom',
  followers: 356,
  foundationYear: 2010,
  achievements: [
    'Nagroda "Organizacja Roku 2018" przyznana przez Ministerstwo Rodziny i Polityki Społecznej',
    'Wyróżnienie za działalność charytatywną od Prezydenta miasta Warszawa w 2020 roku',
    'Status Organizacji Pożytku Publicznego od 2012 roku'
  ],
  team: [
    {
      id: 1,
      name: 'Anna Nowak',
      position: 'Prezes Zarządu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      name: 'Marek Kowalski',
      position: 'Wiceprezes ds. Finansowych',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      name: 'Katarzyna Wiśniewska',
      position: 'Koordynator Projektów',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ],
  upcomingEvents: [
    {
      id: 201,
      title: 'Piknik Rodzinny "Razem dla Dzieci"',
      date: '15.06.2023',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 202,
      title: 'Warsztaty Artystyczne dla Dzieci',
      date: '22.06.2023',
      image: 'https://images.unsplash.com/photo-1559131651-cbb842b8337c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 203,
      title: 'Zbiórka Przyborów Szkolnych',
      date: '10.08.2023 - 25.08.2023',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ],
  pastEvents: [
    {
      id: 204,
      title: 'Bal Charytatywny "Świąteczne Marzenia"',
      date: '10.12.2022',
      image: 'https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 205,
      title: 'Rodzinne Warsztaty Wielkanocne',
      date: '02.04.2023',
      image: 'https://images.unsplash.com/photo-1521673461164-de300ebcfb17?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559131651-cbb842b8337c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ]
};

const OrganizationProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [organization, setOrganization] = useState(organizationData);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if user is logged in and is the owner
  const userType = user?.user_metadata?.userType || null;
  const isLoggedIn = !!user;
  const isOwner = userType === 'organization' && user?.id === id;

  const handleContact = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };

  return (
    <Layout>
      <OrganizationHeader
        organization={organization}
        isLoggedIn={isLoggedIn}
        isOwner={isOwner}
        following={following}
        setFollowing={setFollowing}
        handleContact={handleContact}
      />

      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="mb-8">
              <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="about" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  O organizacji
                </TabsTrigger>
                <TabsTrigger 
                  value="events" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Wydarzenia
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Galeria
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <AboutTab organization={organization} />
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <EventsTab organization={organization} isOwner={isOwner} />
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-0">
                <GalleryTab organization={organization} isOwner={isOwner} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <ContactSidebar organization={organization} />

            {isLoggedIn && userType === 'sponsor' && (
              <SponsorshipCard userType={userType} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationProfile;
