
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Przykładowe dane dla użytkowników demo
const demoOrganizations = [
  {
    id: 'org-1',
    name: 'Demo Organizacja',
    description: 'To jest przykładowa organizacja demo, stworzona automatycznie w systemie.',
    logo_url: null,
    event_count: 4
  },
  {
    id: 'org-2',
    name: 'Fundacja Pomocy Dzieciom',
    description: 'Wspieramy dzieci w trudnych sytuacjach życiowych, organizując wydarzenia charytatywne.',
    logo_url: null,
    event_count: 3
  },
  {
    id: 'org-3',
    name: 'Stowarzyszenie Kulturalne "Artystyczna Przystań"',
    description: 'Promocja kultury i sztuki poprzez organizację wystaw, koncertów i warsztatów.',
    logo_url: null,
    event_count: 5
  }
];

export const OrganizationsList = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ładowanie organizacji...</p>
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <Link to={`/organizacje/${org.id}`} key={org.id}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-ngo/20 flex items-center justify-center text-ngo font-semibold text-lg mr-3">
                  {org.name.substring(0, 2)}
                </div>
                <h3 className="font-semibold text-lg">{org.name}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {org.description || 'Brak opisu'}
              </p>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-ngo/10">
                  {org.event_count} wydarzeń
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
