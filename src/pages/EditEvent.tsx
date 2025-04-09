
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { eventFormSchema, EventFormValues, SponsorshipOption } from '@/components/events/edit/EventEditSchema';
import { useEventImageUpload } from '@/hooks/useEventImageUpload';
import { fetchEventById, updateEvent, deleteEvent } from '@/services/eventService';
import EventEditForm from '@/components/events/edit/EventEditForm';
import LoadingState from '@/components/common/LoadingState';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sponsorshipOptions, setSponsorshipOptions] = useState<SponsorshipOption[]>([]);
  
  const { 
    uploadedImageUrl, 
    setUploadedImageUrl, 
    handleImageUpload 
  } = useEventImageUpload();

  // Initialize form with resolver
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      detailed_location: '',
      expected_participants: '',
      category: '',
      audience: '',
      tags: '',
      facebook: '',
      linkedin: '',
      status: 'Planowane',
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby edytować wydarzenie.",
        variant: "destructive",
      });
      navigate('/logowanie');
      return;
    }

    if (!id) {
      toast({
        title: "Błąd",
        description: "Brak identyfikatora wydarzenia.",
        variant: "destructive",
      });
      navigate('/wydarzenia');
      return;
    }

    const loadEventData = async () => {
      setLoading(true);
      
      try {
        const eventData = await fetchEventById(id);
        
        if (!eventData) {
          toast({
            title: "Nie znaleziono",
            description: "Wydarzenie o podanym ID nie istnieje.",
            variant: "destructive"
          });
          navigate('/wydarzenia');
          return;
        }
        
        // Check if the user is the owner of the organization that created the event
        if (user.id !== eventData.organizations.user_id) {
          toast({
            title: "Brak uprawnień",
            description: "Nie masz uprawnień do edycji tego wydarzenia.",
            variant: "destructive"
          });
          navigate(`/wydarzenia/${id}`);
          return;
        }
        
        setEvent(eventData);
        
        // Extract social media values from JSON
        const socialMedia = eventData.social_media ? eventData.social_media : {};
        
        // Set form values from event data
        methods.reset({
          title: eventData.title || '',
          description: eventData.description || '',
          start_date: eventData.start_date ? new Date(eventData.start_date) : new Date(),
          end_date: eventData.end_date ? new Date(eventData.end_date) : undefined,
          location: eventData.location || '',
          detailed_location: eventData.detailed_location || '',
          expected_participants: eventData.expected_participants ? String(eventData.expected_participants) : '',
          category: eventData.category || '',
          audience: eventData.audience ? eventData.audience.join(', ') : '',
          tags: eventData.tags ? eventData.tags.join(', ') : '',
          image_url: eventData.image_url || '',
          facebook: socialMedia && typeof socialMedia === 'object' ? (socialMedia as any).facebook || '' : '',
          linkedin: socialMedia && typeof socialMedia === 'object' ? (socialMedia as any).linkedin || '' : '',
          instagram: socialMedia && typeof socialMedia === 'object' ? (socialMedia as any).instagram || '' : '',
          status: eventData.status || 'Planowane',
        });

        setUploadedImageUrl(eventData.image_url || null);
        
        // Set sponsorship options if available
        if (eventData.sponsorshipOptions && Array.isArray(eventData.sponsorshipOptions)) {
          const formattedOptions: SponsorshipOption[] = eventData.sponsorshipOptions.map((option: any) => ({
            id: option.id || uuidv4(),
            title: option.title || '',
            description: option.description || '',
            priceFrom: option.price ? String(option.price) : '0',
            priceTo: option.price_to ? String(option.price_to) : '0', // Fix here: use price_to from the database
            benefits: Array.isArray(option.benefits) ? option.benefits : [],
          }));
          setSponsorshipOptions(formattedOptions);
        } else {
          // Add an empty sponsorship option by default if none exists
          handleAddSponsorshipOption();
        }
        
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem z pobieraniem danych wydarzenia.",
          variant: "destructive"
        });
        navigate('/wydarzenia');
      } finally {
        setLoading(false);
      }
    };
    
    loadEventData();
  }, [id, user, toast, navigate, methods, setUploadedImageUrl]);
  
  // Sponsorship options handlers
  const handleAddSponsorshipOption = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSponsorshipOptions(prev => [
      ...prev,
      {
        id: uuidv4(),
        title: '',
        description: '',
        priceFrom: '',
        priceTo: '',
        benefits: []
      }
    ]);
  };

  const handleRemoveSponsorshipOption = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSponsorshipOptions(prev => prev.filter(option => option.id !== id));
  };

  const handleSponsorshipOptionChange = (id: string, field: keyof SponsorshipOption, value: string | string[]) => {
    setSponsorshipOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleAddBenefit = (id: string, benefit: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!benefit.trim()) return;
    
    setSponsorshipOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, benefits: [...option.benefits, benefit.trim()] } 
          : option
      )
    );
  };

  const handleRemoveBenefit = (id: string, benefit: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSponsorshipOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, benefits: option.benefits.filter(b => b !== benefit) } 
          : option
      )
    );
  };

  const handleSponsorshipNumberChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    handleSponsorshipOptionChange(id, field, value);
  };
  
  const onSubmit = async (data: EventFormValues) => {
    if (!user || !event || !id) return;
    
    setSubmitting(true);
    
    try {
      await updateEvent(id, data, uploadedImageUrl, sponsorshipOptions);
      
      toast({
        title: "Sukces!",
        description: "Wydarzenie zostało zaktualizowane pomyślnie.",
      });
      
      // Navigate to the event details page
      navigate(`/wydarzenia/${id}`);
      
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować wydarzenia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id || !user) return;
    
    setDeleting(true);
    
    try {
      await deleteEvent(id);
      
      toast({
        title: "Wydarzenie usunięte",
        description: "Wydarzenie zostało pomyślnie usunięte.",
      });
      
      // Navigate to the events list
      navigate('/wydarzenia');
      
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć wydarzenia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Ładowanie danych wydarzenia..." />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edytuj wydarzenie</h1>
          <p className="text-muted-foreground">
            Zaktualizuj informacje o swoim wydarzeniu
          </p>
        </div>
        
        <EventEditForm 
          methods={methods}
          onSubmit={onSubmit}
          submitting={submitting}
          uploadedImageUrl={uploadedImageUrl}
          handleImageUpload={handleImageUpload}
          sponsorshipOptions={sponsorshipOptions}
          handleAddSponsorshipOption={handleAddSponsorshipOption}
          handleRemoveSponsorshipOption={handleRemoveSponsorshipOption}
          handleSponsorshipOptionChange={handleSponsorshipOptionChange}
          handleAddBenefit={handleAddBenefit}
          handleRemoveBenefit={handleRemoveBenefit}
          handleSponsorshipNumberChange={handleSponsorshipNumberChange}
          onDelete={handleDeleteEvent}
          deleting={deleting}
        />
      </div>
    </Layout>
  );
};

export default EditEvent;
