
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  LinkIcon, 
  Facebook, 
  Linkedin, 
  Clock, 
  Tag,
  MessageSquare,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Przykładowe dane wydarzenia
const eventData = {
  id: 1,
  title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
  organization: {
    id: 101,
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    avatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  date: '15.06.2023',
  location: 'Park Centralny, Warszawa, mazowieckie',
  attendees: 350,
  category: 'Charytatywne',
  status: 'Planowane',
  description: 'Bieg charytatywny, z którego całkowity dochód zostanie przeznaczony na pomoc dzieciom w domach dziecka. Wydarzenie skierowane jest zarówno do profesjonalnych biegaczy jak i amatorów. Do wyboru będą trasy o długości 5 km, 10 km oraz półmaraton.\n\nNasza fundacja od ponad 10 lat wspiera dzieci z domów dziecka i rodzin zastępczych. Dzięki zebranym środkom będziemy mogli sfinansować zajęcia dodatkowe, wycieczki edukacyjne oraz materiały szkolne dla podopiecznych.',
  banner: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  audience: ['Rodziny z dziećmi', 'Biegacze amatorzy', 'Sportowcy', 'Firmy', 'Wolontariusze'],
  tags: ['bieg', 'charytatywny', 'pomoc dzieciom', 'sport', 'event sportowy', 'fundacja'],
  socialMedia: {
    facebook: 'https://facebook.com/event',
    linkedin: 'https://linkedin.com/event'
  },
  sponsorshipOptions: [
    {
      id: 1,
      title: 'Partner Główny',
      description: 'Logo na materiałach promocyjnych, bannery na miejscu wydarzenia, miejsce na stoisko, logo na koszulkach uczestników, wyróżnienie podczas ceremonii.',
      price: { from: 5000, to: 10000 }
    },
    {
      id: 2,
      title: 'Partner Wspierający',
      description: 'Logo na materiałach promocyjnych, banner na miejscu wydarzenia, wyróżnienie podczas ceremonii.',
      price: { from: 2000, to: 4000 }
    },
    {
      id: 3,
      title: 'Partner Medialny',
      description: 'Relacje z wydarzenia, promocja w mediach partnera.',
      price: null
    },
    {
      id: 4,
      title: 'Sponsor Nagród',
      description: 'Przekazanie nagród dla uczestników, wyróżnienie podczas ceremonii wręczenia nagród.',
      price: { from: 1000, to: 3000 }
    }
  ],
  updates: [
    {
      id: 1,
      date: '30.04.2023',
      title: 'Ruszamy z rejestracją!',
      content: 'Z radością informujemy, że uruchomiliśmy rejestrację na nasz bieg charytatywny. Liczba miejsc jest ograniczona, więc zachęcamy do szybkiego zapisywania się!',
      image: null
    },
    {
      id: 2,
      date: '15.05.2023',
      title: 'Ogłaszamy pierwszych partnerów',
      content: 'Z przyjemnością ogłaszamy pierwszych partnerów naszego wydarzenia. Dziękujemy za wsparcie i zaangażowanie w pomoc dzieciom!',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ]
};

// Stan logowania użytkownika (demo)
const demoUserState = {
  isLoggedIn: false,
  userType: null as null | 'sponsor' | 'organization',
  isOwner: false
};

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [userState] = useState(demoUserState);
  
  // W rzeczywistej aplikacji tutaj pobieralibyśmy dane wydarzenia na podstawie ID

  return (
    <Layout>
      {/* Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        <img 
          src={eventData.banner} 
          alt={eventData.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 md:left-12">
          <div className={`
            inline-block rounded-full px-3 py-1 text-xs font-medium mb-2 bg-white
            ${eventData.status === 'Planowane' ? 'text-blue-700' : 
              eventData.status === 'W przygotowaniu' ? 'text-yellow-700' : 
              eventData.status === 'W trakcie' ? 'text-green-700' : 
              'text-gray-700'}
          `}>
            {eventData.status}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">
            {eventData.title}
          </h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Informacje o organizacji */}
            <Link to={`/organizacje/${eventData.organization.id}`} className="flex items-center mb-6 hover:text-ngo transition-colors">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={eventData.organization.avatar} alt={eventData.organization.name} />
                <AvatarFallback>{eventData.organization.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Organizator</p>
                <h3 className="font-semibold">{eventData.organization.name}</h3>
              </div>
            </Link>

            {/* Podstawowe informacje */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center border rounded-lg p-4">
                <Calendar size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{eventData.date}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <MapPin size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Lokalizacja</p>
                  <p className="font-medium">{eventData.location}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <Users size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Uczestnicy</p>
                  <p className="font-medium">{eventData.attendees} osób</p>
                </div>
              </div>
            </div>

            {/* Treść wydarzenia */}
            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Szczegóły
                </TabsTrigger>
                <TabsTrigger 
                  value="updates" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Aktualności
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold mb-4">Opis wydarzenia</h2>
                  {eventData.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Odbiorcy</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.audience.map((audience, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Kategoria</h3>
                  <Badge className="bg-ngo text-white px-3 py-1 text-sm">
                    {eventData.category}
                  </Badge>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Tagi</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        <Tag size={14} className="mr-1" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {eventData.socialMedia && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Media społecznościowe</h3>
                    <div className="flex space-x-4">
                      {eventData.socialMedia.facebook && (
                        <a 
                          href={eventData.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-ngo hover:underline"
                        >
                          <Facebook size={20} className="mr-2" /> Facebook
                        </a>
                      )}
                      {eventData.socialMedia.linkedin && (
                        <a 
                          href={eventData.socialMedia.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-ngo hover:underline"
                        >
                          <Linkedin size={20} className="mr-2" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="updates" className="mt-0">
                <h2 className="text-2xl font-bold mb-6">Aktualności</h2>
                
                {eventData.updates.length > 0 ? (
                  <div className="space-y-8">
                    {eventData.updates.map((update) => (
                      <Card key={update.id} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{update.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              {update.date}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{update.content}</p>
                          {update.image && (
                            <img 
                              src={update.image} 
                              alt={update.title} 
                              className="rounded-md w-full max-h-72 object-cover"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nie dodano jeszcze żadnych aktualności dla tego wydarzenia.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {/* Możliwości sponsorowania */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Możliwości współpracy</CardTitle>
              </CardHeader>
              <CardContent>
                {!userState.isLoggedIn && (
                  <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
                    <p className="mb-3 font-medium">Zainteresowany sponsorowaniem tego typu wydarzenia?</p>
                    <Link to="/logowanie">
                      <Button className="btn-gradient w-full">
                        Zaloguj się, aby móc się skontaktować
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {eventData.sponsorshipOptions.map((option) => (
                    <div key={option.id} className="border rounded-md p-4">
                      <h4 className="font-semibold mb-2">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      
                      {userState.isLoggedIn && userState.userType === 'sponsor' && option.price && (
                        <p className="text-sm font-medium">
                          Budżet: {option.price.from} - {option.price.to} PLN
                        </p>
                      )}
                      
                      {!userState.isLoggedIn && option.price && (
                        <p className="text-sm italic text-muted-foreground">
                          Szczegóły cenowe dostępne po zalogowaniu
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {userState.isLoggedIn && userState.userType === 'sponsor' && (
                  <Button className="w-full mt-4 btn-gradient">
                    <MessageSquare size={16} className="mr-2" /> Skontaktuj się z organizacją
                  </Button>
                )}
                
                {userState.isLoggedIn && userState.userType === 'organization' && userState.isOwner && (
                  <Button className="w-full mt-4">
                    <Edit size={16} className="mr-2" /> Edytuj wydarzenie
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Udostępnij */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Udostępnij wydarzenie</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Skopiowano link",
                      description: "Link do wydarzenia został skopiowany do schowka.",
                    });
                  }}
                >
                  <LinkIcon size={16} className="mr-2" /> Kopiuj link
                </Button>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                    <Facebook size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                    <Linkedin size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
