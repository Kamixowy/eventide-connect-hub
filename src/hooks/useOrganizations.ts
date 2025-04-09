
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Demo organizations data
const demoOrganizations = [
  {
    id: 'org-1',
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    description: 'Wspieramy dzieci w trudnej sytuacji życiowej, organizując różne formy pomocy.',
    logo_url: null,
    category: 'Charytatywne',
    followers: 120,
    user_id: 'demo-organization'
  },
  {
    id: 'org-2',
    name: 'Stowarzyszenie Młodych Artystów',
    description: 'Promujemy młode talenty i organizujemy warsztaty artystyczne dla dzieci i młodzieży.',
    logo_url: null,
    category: 'Kulturalne',
    followers: 85,
    user_id: 'other-org'
  },
  {
    id: 'org-3',
    name: 'Fundacja Zielona Przyszłość',
    description: 'Działamy na rzecz ochrony środowiska i edukacji ekologicznej społeczeństwa.',
    logo_url: null,
    category: 'Ekologiczne',
    followers: 210,
    user_id: 'other-org'
  },
  {
    id: 'org-4',
    name: 'Stowarzyszenie Sportowe "Volley"',
    description: 'Promujemy aktywność fizyczną wśród młodzieży i organizujemy turnieje sportowe.',
    logo_url: null,
    category: 'Sportowe',
    followers: 150,
    user_id: 'other-org'
  }
];

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string | null;
  category?: string;
  followers?: number;
  user_id: string;
  isCurrentUserOrg?: boolean;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      
      // Demo user or testing environment
      if (user && user.id.startsWith('demo-')) {
        // For demo users, mark their own organization
        const markedDemoOrgs = demoOrganizations.map(org => ({
          ...org,
          isCurrentUserOrg: user.id === org.user_id
        }));
        setOrganizations(markedDemoOrgs);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch all organizations
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Mark the organizations that belong to the current user
        const orgsWithOwnership = (data.length > 0 ? data : demoOrganizations).map(org => ({
          ...org,
          isCurrentUserOrg: user?.id === org.user_id
        }));
        
        setOrganizations(orgsWithOwnership);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy organizacji. Wyświetlamy przykładowe dane.",
          variant: "destructive"
        });
        
        // Mark demo data for current user if applicable
        const markedDemoOrgs = demoOrganizations.map(org => ({
          ...org,
          isCurrentUserOrg: user?.id === org.user_id
        }));
        setOrganizations(markedDemoOrgs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [user, toast]);

  return { organizations, loading };
};
