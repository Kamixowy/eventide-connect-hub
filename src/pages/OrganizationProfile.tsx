
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import OrganizationHeader from '@/components/organizations/profile/OrganizationHeader';
import AboutTab from '@/components/organizations/profile/AboutTab';
import EventsTab from '@/components/organizations/profile/EventsTab';
import GalleryTab from '@/components/organizations/profile/GalleryTab';
import ContactSidebar from '@/components/organizations/profile/ContactSidebar';
import SponsorshipCard from '@/components/organizations/profile/SponsorshipCard';

// Define a proper interface for the organization data
interface OrganizationData {
  id: string; // Changed from number to string to match Supabase UUID
  name: string;
  description: string;
  logo: string;
  cover: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  category: string;
  followers: number;
  foundationYear: number;
  achievements: string[];
  team: {
    id: number;
    name: string;
    position: string;
    avatar: string;
  }[];
  upcomingEvents: {
    id: number;
    title: string;
    date: string;
    image: string;
  }[];
  pastEvents: {
    id: number;
    title: string;
    date: string;
    image: string;
  }[];
  gallery: string[];
  user_id?: string; // Added user_id property as optional
}

// Example organization data (jako dane awaryjne, gdy nie można pobrać danych z bazy)
const fallbackOrganizationData: OrganizationData = {
  id: '101', // Changed from number to string
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
  ],
  user_id: '' // Added empty user_id
};

const OrganizationProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [organization, setOrganization] = useState<OrganizationData>(fallbackOrganizationData);
  const [loading, setLoading] = useState(true);
  
  // Pobierz dane organizacji z Supabase
  useEffect(() => {
    const fetchOrganizationData = async () => {
      setLoading(true);
      
      // Jeśli nie mamy ID, używamy przykładowych danych
      if (!id) {
        setLoading(false);
        return;
      }

      // Dla użytkowników demo, używamy przykładowych danych
      if (user && user.id.startsWith('demo-')) {
        // Zmień ID na rzeczywiste ID organizacji, aby pasowało do URL
        setOrganization({
          ...fallbackOrganizationData,
          id: id
        });
        setLoading(false);
        return;
      }
      
      // Pobierz dane z Supabase
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching organization data:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać danych organizacji.",
            variant: "destructive"
          });
          return;
        }
        
        if (!data) {
          // Organizacja nie istnieje, przekieruj do strony 404
          navigate('/404');
          return;
        }
        
        // Przekształć dane z Supabase na format używany w komponencie
        const formattedData: OrganizationData = {
          ...fallbackOrganizationData,
          id: data.id,
          name: data.name || 'Organizacja bez nazwy',
          description: data.description || fallbackOrganizationData.description,
          logo: data.logo_url || fallbackOrganizationData.logo,
          cover: data.logo_url || fallbackOrganizationData.cover,
          location: data.address || 'Brak adresu',
          email: data.contact_email || 'Brak adresu email',
          phone: data.phone || 'Brak numeru telefonu',
          website: data.website || 'https://www.example.com',
          user_id: data.user_id || '', // Include user_id from database
          // Pozostałe dane pozostawiamy z domyślnego obiektu
        };
        
        setOrganization(formattedData);
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: "Błąd",
          description: "Wystąpił problem podczas ładowania danych.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizationData();
  }, [id, user, toast, navigate]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if user is logged in and is the owner
  const userType = user?.user_metadata?.userType || null;
  const isLoggedIn = !!user;
  const isOwner = userType === 'organization' && user?.id === organization.user_id;

  const handleContact = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Ładowanie danych organizacji...</p>
        </div>
      </Layout>
    );
  }

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
