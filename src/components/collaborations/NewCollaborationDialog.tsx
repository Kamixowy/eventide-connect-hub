import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, MinusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { 
  createCollaboration, 
  CollaborationOption 
} from '@/services/collaborations';
import { COLLABORATION_STATUSES } from '@/services/collaborations/utils';

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
    (sum, option) => sum + (parseFloat(option.amount.toString()) || 0), 
    0
  );
  
  useEffect(() => {
    const loadSponsorshipOptions = async () => {
      if (selectedEventIds.length === 0) {
        setSponsorshipOptions([]);
        return;
      }
      
      try {
        console.log("Ładowanie opcji sponsoringu dla wydarzeń:", selectedEventIds);
        
        const { data, error } = await supabase
          .from('sponsorship_options')
          .select('*')
          .in('event_id', selectedEventIds);
          
        if (error) {
          console.error("Błąd podczas ładowania opcji sponsoringu:", error);
          throw error;
        }
        
        console.log("Załadowane opcje sponsoringu:", data);
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
          
        if (error) {
          console.error("Błąd podczas ładowania organizacji:", error);
          throw error;
        }
        
        console.log("Załadowane organizacje:", data);
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
        console.log("Ładowanie wydarzeń dla organizacji:", selectedOrganizationId);
        
        const { data, error } = await supabase
          .from('events')
          .select('id, title, start_date, image_url')
          .eq('organization_id', selectedOrganizationId);
          
        if (error) {
          console.error("Błąd podczas ładowania wydarzeń:", error);
          throw error;
        }
        
        console.log("Załadowane wydarzenia:", data);
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
          description: option.description || undefined,
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
    
    try {
      setIsLoading(true);
      
      console.log("Tworzenie nowej współpracy:", {
        sponsor_id: user?.id || '',
        organization_id: selectedOrganizationId,
        status: COLLABORATION_STATUSES.SENT,
        message: message,
        total_amount: totalAmount
      });
      
      const collaborationId = await createCollaboration(
        {
          sponsor_id: user?.id || '',
          organization_id: selectedOrganizationId,
          status: COLLABORATION_STATUSES.SENT,
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
            <div>
              <h3 className="text-lg font-semibold mb-3">Wybierz organizację</h3>
              
              <div className="space-y-4">
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedOrganizationId}
                  onChange={handleOrganizationChange}
                  disabled={!!organizationId}
                >
                  <option value="">Wybierz organizację</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Wybierz wydarzenia</h3>
              
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`event-${event.id}`}
                        checked={selectedEventIds.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                        disabled={!!eventId && eventId !== event.id}
                      />
                      <Label htmlFor={`event-${event.id}`} className="cursor-pointer">
                        {event.title}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                selectedOrganizationId ? (
                  <p className="text-muted-foreground">
                    Ta organizacja nie ma jeszcze żadnych wydarzeń
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Najpierw wybierz organizację
                  </p>
                )
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Opcje sponsoringu</h3>
              
              {selectedEventIds.length > 0 ? (
                sponsorshipOptions.length > 0 ? (
                  <div className="space-y-3">
                    {sponsorshipOptions.map((option) => (
                      <div 
                        key={option.id} 
                        className={`
                          border rounded-lg p-3 cursor-pointer transition
                          ${selectedOptions.some(o => o.sponsorship_option_id === option.id) 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => toggleOption(option)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {option.description || 'Brak opisu'}
                            </p>
                            
                            {option.benefits && option.benefits.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {option.benefits.map((benefit, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="font-bold">{option.price} PLN</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    Wybrane wydarzenia nie mają zdefiniowanych opcji sponsoringu
                  </p>
                )
              ) : (
                <p className="text-muted-foreground mb-4">
                  Najpierw wybierz wydarzenie
                </p>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={addCustomOption}
              >
                <Plus size={16} className="mr-2" /> 
                Dodaj własną opcję
              </Button>
            </div>
            
            {selectedOptions.filter(o => o.is_custom).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Własne opcje</h3>
                
                {selectedOptions.map((option, index) => {
                  if (!option.is_custom) return null;
                  
                  return (
                    <Card key={index} className="p-4 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeCustomOption(index)}
                      >
                        <MinusCircle size={18} />
                      </button>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`option-title-${index}`}>Nazwa</Label>
                          <Input 
                            id={`option-title-${index}`}
                            value={option.title} 
                            onChange={(e) => updateCustomOption(index, 'title', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`option-desc-${index}`}>Opis</Label>
                          <Textarea 
                            id={`option-desc-${index}`}
                            value={option.description || ''} 
                            onChange={(e) => updateCustomOption(index, 'description', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`option-amount-${index}`}>Kwota (PLN)</Label>
                          <Input 
                            id={`option-amount-${index}`}
                            type="number" 
                            value={option.amount} 
                            onChange={(e) => updateCustomOption(index, 'amount', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Wiadomość</h3>
              <Textarea 
                placeholder="Dodaj wiadomość dla organizacji..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Podsumowanie</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Organizacja</p>
                  <p className="font-medium">
                    {organizations.find(o => o.id === selectedOrganizationId)?.name || 'Nie wybrano'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Wydarzenia</p>
                  {selectedEventIds.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedEventIds.map(id => {
                        const event = events.find(e => e.id === id);
                        return (
                          <li key={id} className="font-medium">
                            {event?.title || 'Nieznane wydarzenie'}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="font-medium">Nie wybrano</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Wybrane opcje</p>
                  {selectedOptions.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {selectedOptions.map((option, i) => (
                        <li key={i} className="font-medium">
                          {option.title} - {option.amount} PLN
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-medium">Nie wybrano</p>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-lg font-semibold">Łączna kwota</p>
                  <p className="text-2xl font-bold">{totalAmount} PLN</p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleSubmit}
                disabled={
                  isLoading || 
                  !selectedOrganizationId || 
                  selectedOptions.length === 0
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Wysyłanie...
                  </>
                ) : (
                  "Wyślij propozycję"
                )}
              </Button>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollaborationDialog;
