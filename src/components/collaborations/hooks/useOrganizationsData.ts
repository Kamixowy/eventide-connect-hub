
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useOrganizationsData = (initialOrganizationId?: string) => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(initialOrganizationId || '');
  
  // Load organizations
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, logo_url');
          
        if (error) throw error;
        
        setOrganizations(data || []);
        
        if (!selectedOrganizationId && data && data.length > 0 && !initialOrganizationId) {
          setSelectedOrganizationId(data[0].id);
        }
      } catch (error: any) {
        console.error('Błąd podczas ładowania organizacji:', error);
      }
    };
    
    loadOrganizations();
  }, [initialOrganizationId, selectedOrganizationId]);

  const handleOrganizationChange = (value: string) => {
    setSelectedOrganizationId(value);
  };

  return {
    organizations,
    selectedOrganizationId,
    setSelectedOrganizationId,
    handleOrganizationChange
  };
};
