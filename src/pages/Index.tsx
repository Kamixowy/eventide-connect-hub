import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import CookieConsent from '@/components/common/CookieConsent';

// Przykładowe dane wydarzeń
const sampleEvents = [{
  id: 1,
  title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
  organization: 'Fundacja Szczęśliwe Dzieciństwo',
  date: '15.06.2023',
  location: 'Warszawa',
  attendees: 350,
  category: 'Charytatywne',
  status: 'Planowane',
  image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}, {
  id: 2,
  title: 'Festiwal Kultury Studenckiej',
  organization: 'Stowarzyszenie Młodych Artystów',
  date: '22.07.2023 - 25.07.2023',
  location: 'Kraków',
  attendees: 1200,
  category: 'Kulturalne',
  status: 'W przygotowaniu',
  image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}, {
  id: 3,
  title: 'Eko Piknik Rodzinny',
  organization: 'Fundacja Zielona Przyszłość',
  date: '10.08.2023',
  location: 'Gdańsk',
  attendees: 500,
  category: 'Ekologiczne',
  status: 'Planowane',
  image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}, {
  id: 4,
  title: 'Międzynarodowy Turniej Siatkówki',
  organization: 'Stowarzyszenie Sportowe "Volley"',
  date: '05.09.2023 - 08.09.2023',
  location: 'Poznań',
  attendees: 800,
  category: 'Sportowe',
  status: 'W przygotowaniu',
  image: 'https://images.unsplash.com/photo-1588492069485-d05b56b2831d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}];

// Komponent karty wydarzenia
const EventCard = ({
  event
}: {
  event: typeof sampleEvents[0];
}) => {
  return <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-medium">
          {event.category}
        </div>
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
          ${event.status === 'Planowane' ? 'bg-blue-100 text-blue-700' : event.status === 'W przygotowaniu' ? 'bg-yellow-100 text-yellow-700' : event.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
        `}>
          {event.status}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{event.organization}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={16} className="mr-2 text-ngo" /> 
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users size={16} className="mr-2 text-ngo" /> 
            <span>Przewidywana liczba uczestników: {event.attendees}</span>
          </div>
        </div>
        
        <Link to={`/wydarzenia/${event.id}`}>
          <Button variant="outline" className="w-full">Zobacz szczegóły</Button>
        </Link>
      </CardContent>
    </Card>;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-ngo overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-white/[0.2]" />
        <div className="container relative text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            Łączymy organizacje z potencjalnymi sponsorami wydarzeń
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Stwórz profil, przedstaw swoje wydarzenie i znajdź idealnych partnerów
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center mb-12">
            <Link to="/rejestracja?type=organization">
              <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                Zarejestruj Organizację
              </Button>
            </Link>
            <Link to="/rejestracja?type=sponsor">
              <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                Zarejestruj się jako Sponsor
              </Button>
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-3 flex items-center">
            <Input placeholder="Szukaj wydarzeń, organizacji..." className="border-0 focus-visible:ring-0 flex-grow" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <Button type="submit" className="btn-gradient ml-2 px-6">
              <Search size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Jak działa N-GO?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ngo/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ngo">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Zarejestruj się</h3>
              <p className="text-muted-foreground">
                Wybierz rodzaj konta - organizacja lub sponsor - i stwórz swój profil na N-GO.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ngo/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ngo">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dodaj lub przeglądaj</h3>
              <p className="text-muted-foreground">
                Organizacje dodają wydarzenia, a sponsorzy przeglądają i wybierają te, które chcą wesprzeć.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ngo/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ngo">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nawiąż współpracę</h3>
              <p className="text-muted-foreground">
                Komunikuj się bezpośrednio, ustalaj warunki i rozpocznij owocną współpracę.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Przykładowe wydarzenia
            </h2>
              <p className="text-muted-foreground">
                Odkryj najnowsze wydarzenia czekające na sponsorów
              </p>
            </div>
            <Link to="/wydarzenia" className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center">
                Zobacz wszystkie <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-ngo text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto">
            Gotowy, aby zaprezentować swoje wydarzenie lub znaleźć nowe możliwości współpracy?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Dołącz do N-GO już dziś i zacznij budować wartościowe partnerstwa
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
            <Link to="/rejestracja?type=organization">
              <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                Zarejestruj Organizację
              </Button>
            </Link>
            <Link to="/rejestracja?type=sponsor">
              <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                Zarejestruj się jako Sponsor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add Cookie Consent */}
      <CookieConsent />
    </Layout>;
};

export default Index;
