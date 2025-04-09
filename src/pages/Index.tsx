
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import CookieConsent from '@/components/common/CookieConsent';
import { useAuth } from '@/contexts/AuthContext';
import EventCard from '@/components/common/EventCard';
import { fetchRecentEvents } from '@/services/eventService';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const getRecentEvents = async () => {
      try {
        setLoading(true);
        const events = await fetchRecentEvents();
        setRecentEvents(events);
      } catch (error) {
        console.error('Error fetching recent events:', error);
      } finally {
        setLoading(false);
      }
    };

    getRecentEvents();
  }, []);

  const renderEventCards = () => {
    if (loading) {
      return Array(4).fill(0).map((_, index) => (
        <Card key={`skeleton-${index}`} className="overflow-hidden">
          <div className="h-48 w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ));
    }

    if (recentEvents.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground text-lg mb-4">Brak wydarzeń do wyświetlenia.</p>
          {user && (
            <Link to="/dodaj-wydarzenie">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj wydarzenie
              </Button>
            </Link>
          )}
        </div>
      );
    }

    return recentEvents.map(event => (
      <EventCard 
        key={event.id} 
        event={event} 
        showOrgName={true}
      />
    ));
  };

  return (
    <Layout>
      {/* Hero Section - Different for logged in users */}
      <section className="relative py-20 bg-gradient-ngo overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-white/[0.2]" />
        <div className="container relative text-center text-white z-10">
          {!user ? (
            // Content for non-authenticated users
            <>
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
            </>
          ) : (
            // Content for authenticated users
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
                Witaj, {user.user_metadata?.name || 'użytkowniku'}!
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {user.user_metadata?.userType === 'organization' 
                  ? 'Zarządzaj swoimi wydarzeniami i znajdź sponsorów'
                  : 'Przeglądaj wydarzenia i wspieraj organizacje'}
              </p>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center mb-12">
                {user.user_metadata?.userType === 'organization' ? (
                  <Link to="/dodaj-wydarzenie">
                    <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                      <Plus className="mr-2 h-5 w-5" />
                      Dodaj Nowe Wydarzenie
                    </Button>
                  </Link>
                ) : (
                  <Link to="/wydarzenia">
                    <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                      Przeglądaj Wydarzenia
                    </Button>
                  </Link>
                )}
                <Link to={user.user_metadata?.userType === 'organization' ? "/moje-wydarzenia" : "/moje-wsparcia"}>
                  <Button size="lg" className="bg-white text-ngo hover:bg-gray-100">
                    {user.user_metadata?.userType === 'organization' 
                      ? 'Moje Wydarzenia' 
                      : 'Moje Wsparcia'}
                  </Button>
                </Link>
              </div>
            </>
          )}
          
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

      {/* Recent Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Ostatnie wydarzenia</h2>
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
            {renderEventCards()}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
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
      )}

      {/* Add Cookie Consent */}
      <CookieConsent />
    </Layout>
  );
};

export default Index;
