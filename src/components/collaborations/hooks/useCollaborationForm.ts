
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  createCollaboration
} from '@/services/collaborations';
import { COLLABORATION_STATUSES } from '@/services/collaborations/utils';
import { SponsorshipOption, CollaborationOption } from '../types';

export const useCollaborationForm = (initialEventId?: string, initialOrganizationId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<CollaborationOption[]>([]);
  const [sponsorshipOptions, setSponsorshipOptions] = useState<SponsorshipOption[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(initialEventId ? [initialEventId] : []);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(initialOrganizationId || '');
  const [message, setMessage] = useState('');
  
  const totalAmount = selectedOptions.reduce(
    (sum, option) => sum + (option.amount || 0), 
    0
  );
  
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
  
  // Load events for selected organization
  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedOrganizationId) {
        setEvents([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, start_date, image_url')
          .eq('organization_id', selectedOrganizationId);
          
        if (error) throw error;
        
        setEvents(data || []);
      } catch (error: any) {
        console.error('Błąd podczas ładowania wydarzeń:', error);
      }
    };
    
    loadEvents();
  }, [selectedOrganizationId]);
  
  const toggleOption = (option: SponsorshipOption) => {
    const exists = selectedOptions.some(
      (o) => o.sponsorship_option_id === option.id
    );
    
    if (exists) {
      setSelectedOptions(
        selectedOptions.filter((o) => o.sponsorship_option_id !== option.id)
      );
    } else {
      setSelectedOptions([
        ...selectedOptions,
        {
          title: option.title,
          description: option.description,
          amount: option.price,
          is_custom: false,
          sponsorship_option_id: option.id
        }
      ]);
    }
  };
  
  const addCustomOption = () => {
    setSelectedOptions([
      ...selectedOptions,
      {
        title: 'Nowa opcja',
        description: '',
        amount: 0,
        is_custom: true
      }
    ]);
  };
  
  const removeCustomOption = (index: number) => {
    setSelectedOptions([
      ...selectedOptions.slice(0, index),
      ...selectedOptions.slice(index + 1)
    ]);
  };
  
  const updateCustomOption = (index: number, field: keyof CollaborationOption, value: any) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setSelectedOptions(updatedOptions);
  };
  
  const toggleEvent = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      setSelectedEventIds(selectedEventIds.filter(id => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };
  
  const handleOrganizationChange = (value: string) => {
    setSelectedOrganizationId(value);
    setSelectedEventIds([]);
  };
  
  const createNewCollaboration = async () => {
    if (!selectedOrganizationId) {
      toast({
        title: "Błąd",
        description: "Wybierz organizację",
        variant: "destructive"
      });
      return null;
    }
    
    if (selectedOptions.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedną opcję współpracy",
        variant: "destructive"
      });
      return null;
    }
    
    if (selectedEventIds.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedno wydarzenie",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const collaborationId = await createCollaboration(
        {
          sponsor_id: user?.id || '',
          organization_id: selectedOrganizationId,
          event_id: selectedEventIds[0],
          status: COLLABORATION_STATUSES.PENDING,
          message: message, // Message is now optional
          total_amount: totalAmount
        },
        selectedOptions,
        selectedEventIds
      );
      
      toast({
        title: "Sukces",
        description: "Propozycja współpracy została wysłana"
      });
      
      return collaborationId;
    } catch (error: any) {
      console.error('Błąd podczas tworzenia współpracy:', error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się utworzyć współpracy",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    selectedOptions,
    sponsorshipOptions,
    organizations,
    events,
    selectedEventIds,
    selectedOrganizationId,
    message,
    totalAmount,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    toggleEvent,
    handleOrganizationChange,
    setMessage,
    createNewCollaboration
  };
};
