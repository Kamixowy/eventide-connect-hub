
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Calendar, Info, MapPin, Tag, Users } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Tytuł musi mieć co najmniej 3 znaki' }),
  description: z.string().min(10, { message: 'Opis musi mieć co najmniej 10 znaków' }),
  start_date: z.date({ required_error: 'Data rozpoczęcia jest wymagana' }),
  end_date: z.date().optional(),
  location: z.string().optional(),
  detailed_location: z.string().optional(),
  expected_participants: z.string().optional(),
  category: z.string().optional(),
  audience: z.string().optional(),
  tags: z.string().optional(),
  image_url: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditEvent = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
          facebook: eventData.social_media?.facebook || '',
          linkedin: eventData.social_media?.linkedin || '',
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
  
  const onSubmit = async (data: FormValues) => {
    if (!user || !event) return;
    
    setSubmitting(true);
    
    try {
      // Process array fields
      const audienceArray = data.audience 
        ? data.audience.split(',').map(item => item.trim()).filter(Boolean) 
        : [];
        
      const tagsArray = data.tags 
        ? data.tags.split(',').map(item => item.trim()).filter(Boolean) 
        : [];
      
      // Format social media links
      const socialMedia = {
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `event_images/${fileName}`;
    
    try {
      // Check if the storage bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const eventImagesBucket = buckets?.find(b => b.name === 'event_images');
      
      if (!eventImagesBucket) {
        const { error: bucketError } = await supabase.storage.createBucket('event_images', {
          public: true,
        });
        if (bucketError) throw bucketError;
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('event_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('event_images')
        .getPublicUrl(filePath);
        
      setUploadedImageUrl(data.publicUrl);
      
      toast({
        title: "Zdjęcie przesłane",
        description: "Zdjęcie zostało pomyślnie przesłane.",
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia. Spróbuj ponownie.",
        variant: "destructive"
      });
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
        
        <Form {...form}>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Podstawowe informacje</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tytuł wydarzenia*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nazwa wydarzenia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opis wydarzenia*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Opisz swoje wydarzenie..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data rozpoczęcia*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "dd.MM.yyyy")
                                    ) : (
                                      <span>Wybierz datę</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data zakończenia</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "dd.MM.yyyy")
                                    ) : (
                                      <span>Wybierz datę (opcjonalnie)</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value || undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lokalizacja i uczestnicy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokalizacja</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Miasto, województwo"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="detailed_location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dokładny adres</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ulica, numer, kod pocztowy"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="expected_participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Przewidywana liczba uczestników</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Np. 100"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategoria</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Np. Sportowe, Kulturalne, Edukacyjne"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Odbiorcy (oddzieleni przecinkami)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Np. Rodziny z dziećmi, Seniorzy, Młodzież"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagi (oddzielone przecinkami)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Np. sport, fundraising, pomoc"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Zdjęcie i media społecznościowe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="mb-4">
                      <FormLabel>Zdjęcie wydarzenia</FormLabel>
                      <div className="mt-2">
                        {uploadedImageUrl && (
                          <div className="mb-4">
                            <img
                              src={uploadedImageUrl}
                              alt="Zdjęcie wydarzenia"
                              className="max-w-full h-40 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link do wydarzenia na Facebook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/events/..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link do wydarzenia na LinkedIn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/events/..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
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
      </div>
    </Layout>
  );
};

export default EditEvent;
