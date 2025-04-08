
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  createCollaboration, 
  CollaborationOption 
} from '@/services/collaborations';
import { COLLABORATION_STATUSES } from '@/services/collaborations/utils';

// Import smaller components
import OrganizationSelector from './dialogs/OrganizationSelector';
import EventSelector from './dialogs/EventSelector';
import SponsorshipOptions from './dialogs/SponsorshipOptions';
import CustomOptions from './dialogs/CustomOptions';
import MessageInput from './dialogs/MessageInput';
import CollaborationSummary from './dialogs/CollaborationSummary';

interface SponsorshipOption {
  id: string;
  title: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
}

interface NewCollaborationDialogProps {
  eventId?: string;
  organizationId?: string;
  children: React.ReactNode;
}

const NewCollaborationDialog: React.FC<NewCollaborationDialogProps> = ({
  eventId,
  organizationId,
  children
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<CollaborationOption[]>([]);
  const [sponsorshipOptions, setSponsorshipOptions] = useState<SponsorshipOption[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(eventId ? [eventId] : []);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(organizationId || '');
  const [message, setMessage] = useState('');
  
  const totalAmount = selectedOptions.reduce(
    (sum, option) => sum + (option.amount || 0), 
    0
  );
  
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
  
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, logo_url');
          
        if (error) throw error;
        
        setOrganizations(data || []);
        
        if (!selectedOrganizationId && data && data.length > 0 && !organizationId) {
          setSelectedOrganizationId(data[0].id);
        }
      } catch (error: any) {
        console.error('Błąd podczas ładowania organizacji:', error);
      }
    };
    
    loadOrganizations();
  }, [organizationId, selectedOrganizationId]);
  
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
  
  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrganizationId(e.target.value);
    setSelectedEventIds([]);
  };
  
  const handleSubmit = async () => {
    if (!selectedOrganizationId) {
      toast({
        title: "Błąd",
        description: "Wybierz organizację",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedOptions.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedną opcję współpracy",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedEventIds.length === 0) {
      toast({
        title: "Błąd",
        description: "Wybierz przynajmniej jedno wydarzenie",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const collaborationId = await createCollaboration(
        {
          sponsor_id: user?.id || '',
          organization_id: selectedOrganizationId,
          event_id: selectedEventIds[0],
          status: COLLABORATION_STATUSES.PENDING,
          message: message,
          total_amount: totalAmount
        },
        selectedOptions,
        selectedEventIds
      );
      
      toast({
        title: "Sukces",
        description: "Propozycja współpracy została wysłana"
      });
      
      setOpen(false);
      
      navigate(`/wspolprace/${collaborationId}`);
    } catch (error: any) {
      console.error('Błąd podczas tworzenia współpracy:', error);
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nowa propozycja współpracy</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <OrganizationSelector 
              organizations={organizations}
              selectedOrganizationId={selectedOrganizationId}
              handleOrganizationChange={handleOrganizationChange}
              isDisabled={!!organizationId}
            />
            
            <EventSelector 
              events={events}
              selectedEventIds={selectedEventIds}
              toggleEvent={toggleEvent}
              eventId={eventId}
              selectedOrganizationId={selectedOrganizationId}
            />
            
            <SponsorshipOptions 
              selectedEventIds={selectedEventIds}
              sponsorshipOptions={sponsorshipOptions}
              selectedOptions={selectedOptions}
              toggleOption={toggleOption}
              addCustomOption={addCustomOption}
            />
            
            <CustomOptions 
              selectedOptions={selectedOptions}
              removeCustomOption={removeCustomOption}
              updateCustomOption={updateCustomOption}
            />
            
            <MessageInput 
              message={message}
              setMessage={setMessage}
            />
          </div>
          
          <div className="space-y-6">
            <CollaborationSummary 
              organizations={organizations}
              events={events}
              selectedOrganizationId={selectedOrganizationId}
              selectedEventIds={selectedEventIds}
              selectedOptions={selectedOptions}
              totalAmount={totalAmount}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollaborationDialog;
