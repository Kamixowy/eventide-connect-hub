
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Przykładowe dane dla użytkowników demo
const demoOrganizations = [
  {
    id: 'org-1',
    name: 'Demo Organizacja',
    description: 'To jest przykładowa organizacja demo, stworzona automatycznie w systemie.',
    logo_url: null,
    cover_url: null,
    event_count: 4,
    category: 'Edukacja'
  },
  {
    id: 'org-2',
    name: 'Fundacja Pomocy Dzieciom',
    description: 'Wspieramy dzieci w trudnych sytuacjach życiowych, organizując wydarzenia charytatywne.',
    logo_url: null,
    cover_url: null,
    event_count: 3,
    category: 'Pomoc społeczna'
  },
  {
    id: 'org-3',
    name: 'Stowarzyszenie Kulturalne "Artystyczna Przystań"',
    description: 'Promocja kultury i sztuki poprzez organizację wystaw, koncertów i warsztatów.',
    logo_url: null,
    cover_url: null,
    event_count: 5,
    category: 'Kultura'
  }
];

// Helper function to extract first sentence
const getFirstSentence = (text: string): string => {
  if (!text) return '';
  const firstSentence = text.split(/[.!?][\s\n]/)[0];
  return firstSentence + (firstSentence.endsWith('.') ? '' : '.');
};

export const OrganizationsList = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      
      // Dla użytkowników demo zwracamy statyczne dane
      if (user && user.id.startsWith('demo-')) {
        setOrganizations(demoOrganizations);
        setLoading(false);
        return;
      }
      
      // Dla prawdziwych użytkowników pobieramy dane z Supabase
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('organizations')
            .select('*, events(count)')
            .order('name');
            
          if (error) throw error;
          
          setOrganizations(data.map(org => ({
            ...org,
            event_count: org.events?.[0]?.count || 0
          })));
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [user]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Skeleton className="h-12 w-12 rounded-full mr-3" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nie znaleziono organizacji.</p>
      </div>
    );
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleViewMode}
          className="flex items-center"
        >
          {viewMode === 'grid' ? (
            <>
              <List className="h-4 w-4 mr-2" /> Widok listy
            </>
          ) : (
            <>
              <Grid className="h-4 w-4 mr-2" /> Widok siatki
            </>
          )}
        </Button>
      </div>

      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {organizations.map((org) => (
          <Link to={`/organizacje/${org.id}`} key={org.id}>
            <Card className={`h-full transition-all hover:shadow-md ${viewMode === 'list' ? 'overflow-hidden' : ''}`}>
              {viewMode === 'grid' ? (
                <>
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    {org.cover_url ? (
                      <img 
                        src={org.cover_url} 
                        alt={org.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-ngo/10 flex items-center justify-center">
                        <span className="text-ngo/30 text-xl font-semibold">{org.name}</span>
                      </div>
                    )}
                    {org.category && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-ngo text-white">{org.category}</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={org.logo_url} alt={org.name} />
                        <AvatarFallback className="bg-ngo/20 text-ngo">
                          {org.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {getFirstSentence(org.description) || 'Brak opisu'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-ngo/10">
                        {org.event_count} wydarzeń
                      </Badge>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex p-0 h-32">
                  <div className="w-1/3 h-full overflow-hidden bg-gray-100">
                    {org.cover_url ? (
                      <img 
                        src={org.cover_url} 
                        alt={org.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-ngo/10 flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={org.logo_url} alt={org.name} />
                          <AvatarFallback className="bg-ngo/20 text-ngo text-xl">
                            {org.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      {org.category && (
                        <Badge className="bg-ngo text-white">{org.category}</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {getFirstSentence(org.description) || 'Brak opisu'}
                    </p>
                    <Badge variant="outline" className="bg-ngo/10 mt-auto">
                      {org.event_count} wydarzeń
                    </Badge>
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};
