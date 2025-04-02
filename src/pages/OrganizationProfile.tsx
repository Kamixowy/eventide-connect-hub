
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Globe, 
  Users, 
  FileText, 
  Clock, 
  MessageSquare,
  Edit,
  Plus,
  Heart,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

// Przykładowe dane organizacji
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

  const handleFollow = () => {
    setFollowing(!following);
    toast({
      title: following ? "Przestałeś obserwować" : "Obserwujesz organizację",
      description: following 
        ? "Nie będziesz już otrzymywać powiadomień o nowościach" 
        : "Będziesz otrzymywać powiadomienia o nowych wydarzeniach",
    });
  };

  const handleContact = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };

  return (
    <Layout>
      {/* Cover i avatar */}
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
                  <MapPin size={14} className="mr-1" /> {organization.location}
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
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold mb-4">O nas</h2>
                  {organization.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Osiągnięcia</h3>
                  <ul className="space-y-2">
                    {organization.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                          <div className="h-2 w-2 rounded-full bg-green-600"></div>
                        </div>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Nasz zespół</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {organization.team.map((member) => (
                      <Card key={member.id} className="border">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <Avatar className="h-20 w-20 mb-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Nadchodzące wydarzenia</h2>
                  
                  {organization.upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {organization.upcomingEvents.map((event) => (
                        <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                            <div className="relative h-48 w-full overflow-hidden">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                              <div className="flex items-center text-sm">
                                <Calendar size={16} className="mr-2 text-ngo" /> 
                                <span>{event.date}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Nie ma żadnych nadchodzących wydarzeń.
                    </p>
                  )}
                  
                  {isOwner && (
                    <div className="mt-6">
                      <Link to="/dodaj-wydarzenie">
                        <Button>
                          <Plus size={16} className="mr-2" /> Dodaj nowe wydarzenie
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Poprzednie wydarzenia</h2>
                  
                  {organization.pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {organization.pastEvents.map((event) => (
                        <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                            <div className="relative h-48 w-full overflow-hidden">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Badge variant="outline" className="bg-white text-black">
                                  Zakończone
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                              <div className="flex items-center text-sm">
                                <Calendar size={16} className="mr-2 text-ngo" /> 
                                <span>{event.date}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Nie ma żadnych poprzednich wydarzeń.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-0">
                <h2 className="text-2xl font-bold mb-6">Galeria</h2>
                
                {organization.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {organization.gallery.map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-md">
                        <img 
                          src={image} 
                          alt={`Galeria ${index + 1}`} 
                          className="object-cover w-full h-full hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Galeria jest pusta.
                  </p>
                )}
                
                {isOwner && (
                  <div className="mt-6">
                    <Button>
                      <Plus size={16} className="mr-2" /> Dodaj zdjęcia
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
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
                      <p className="font-medium">{organization.foundationYear}</p>
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

            {isLoggedIn && userType === 'sponsor' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Zainteresowany sponsoringiem?</h3>
                  <p className="text-muted-foreground mb-4">
                    Sprawdź aktualne wydarzenia tej organizacji i nawiąż współpracę!
                  </p>
                  <Button className="w-full btn-gradient">
                    <FileText size={16} className="mr-2" /> Zobacz ofertę współpracy
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationProfile;
