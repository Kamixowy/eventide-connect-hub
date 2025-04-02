import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Calendar, Info, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Import refactored components and utilities
import BasicInfoTab from '@/components/events/edit/BasicInfoTab';
import DetailsTab from '@/components/events/edit/DetailsTab';
import MediaTab from '@/components/events/edit/MediaTab';
import { uploadEventImage, processArrayFields } from '@/utils/eventHelpers';
import { eventFormSchema, EventFormValues, SocialMedia } from '@/components/events/edit/EventEditSchema';

const EditEvent = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Initialize form with resolver
  const form = useForm<EventFormValues>({
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

    const fetchEventDetails = async () => {
      setLoading(true);
      
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*, organizations(id, user_id)')
          .eq('id', id)
          .single();
          
        if (eventError) {
          throw eventError;
        }
        
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
        const socialMedia = eventData.social_media as SocialMedia || {};
        
        // Set form values from event data
        form.reset({
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
          facebook: socialMedia.facebook || '',
          linkedin: socialMedia.linkedin || '',
        });

        setUploadedImageUrl(eventData.image_url || null);
        
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
    
    fetchEventDetails();
  }, [id, user, toast, navigate, form]);
  
  const onSubmit = async (data: EventFormValues) => {
    if (!user || !event) return;
    
    setSubmitting(true);
    
    try {
      // Process array fields
      const audienceArray = processArrayFields(data.audience || '');
      const tagsArray = processArrayFields(data.tags || '');
      
      // Format social media links
      const socialMedia: SocialMedia = {
        facebook: data.facebook || '',
        linkedin: data.linkedin || '',
      };
      
      // Create event object
      const updatedEvent = {
        title: data.title,
        description: data.description,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        location: data.location || null,
        detailed_location: data.detailed_location || null,
        expected_participants: data.expected_participants ? parseInt(data.expected_participants) : null,
        category: data.category || null,
        audience: audienceArray.length > 0 ? audienceArray : null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        social_media: socialMedia,
        image_url: uploadedImageUrl || null,
      };
      
      // Update event in the database
      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', id);
        
      if (error) throw error;
      
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const imageUrl = await uploadEventImage(file);
    
    if (imageUrl) {
      setUploadedImageUrl(imageUrl);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto" />
          <p className="mt-2">Ładowanie danych wydarzenia...</p>
        </div>
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
        
        <FormProvider {...form}>
          <Form>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="basic">
                    <Info className="mr-2 h-4 w-4" />
                    Podstawowe informacje
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <Tag className="mr-2 h-4 w-4" />
                    Szczegóły
                  </TabsTrigger>
                  <TabsTrigger value="media">
                    <Calendar className="mr-2 h-4 w-4" />
                    Media i dodatkowe
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <BasicInfoTab />
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6">
                  <DetailsTab />
                </TabsContent>
                
                <TabsContent value="media" className="space-y-6">
                  <MediaTab 
                    uploadedImageUrl={uploadedImageUrl} 
                    handleImageUpload={handleImageUpload} 
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={submitting}
                  variant="success"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Zapisz zmiany
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default EditEvent;
