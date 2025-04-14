
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SponsorshipOption } from '../types';

export const useSponsorshipOptions = (selectedEventIds: string[]) => {
  const { toast } = useToast();
  const [sponsorshipOptions, setSponsorshipOptions] = useState<SponsorshipOption[]>([]);
  
  // Load sponsorship options for selected events
  useEffect(() => {
    const loadSponsorshipOptions = async () => {
      if (selectedEventIds.length === 0) {
        setSponsorshipOptions([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('sponsorship_options')
          .select('*')
          .in('event_id', selectedEventIds);
          
        if (error) throw error;
        
        setSponsorshipOptions(data || []);
      } catch (error: any) {
        console.error('Błąd podczas ładowania opcji sponsoringu:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się załadować opcji sponsoringu",
          variant: "destructive"
        });
      }
    };
    
    loadSponsorshipOptions();
  }, [selectedEventIds, toast]);

  return {
    sponsorshipOptions
  };
};
