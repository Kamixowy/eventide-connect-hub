
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Mail, 
  Globe, 
  Phone, 
  Save, 
  Building,
  AlertCircle
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Schemat walidacji formularza
const profileFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Nazwa organizacji musi mieć co najmniej 2 znaki.",
  }),
  description: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email({
    message: "Proszę podać prawidłowy adres email.",
  }).optional(),
  phone: z.string().optional(),
  website: z.string().url({
    message: "Proszę podać prawidłowy adres URL.",
  }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOrganization, setIsOrganization] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      organizationName: '',
      description: '',
      location: '',
      email: '',
      phone: '',
      website: '',
    },
  });

  // Sprawdź czy użytkownik jest zalogowany i jest organizacją
  useEffect(() => {
    if (!user) {
      navigate('/logowanie');
      return;
    }

    const userType = user.user_metadata?.userType;
    setIsOrganization(userType === 'organization');
    
    if (userType !== 'organization') {
      toast({
        title: "Brak dostępu",
        description: "Tylko organizacje mają dostęp do tej strony.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Pobierz dane organizacji
    const fetchOrganizationData = async () => {
      if (!isSupabaseConfigured() || !user) {
        // Obsługujemy tryb demo
        setLoading(false);
        form.reset({
          organizationName: user.user_metadata?.name || 'Demo Organizacja',
          description: 'Opis demo organizacji',
          location: 'Warszawa',
          email: user.email || 'demo@example.com',
          phone: '+48 123 456 789',
          website: 'https://example.com',
        });
        return;
      }

      try {
        // Pobierz dane organizacji powiązanej z użytkownikiem
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (orgError) {
          console.error('Błąd podczas pobierania danych organizacji:', orgError);
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać danych organizacji.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (orgData) {
          setOrganizationId(orgData.id);
          form.reset({
            organizationName: orgData.name || '',
            description: orgData.description || '',
            location: orgData.address || '',
            email: orgData.contact_email || user.email || '',
            phone: orgData.phone || '',
            website: orgData.website || '',
          });
          setAvatarUrl(orgData.logo_url);
        }
      } catch (error) {
        console.error('Błąd:', error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem podczas pobierania danych.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [user, navigate, toast, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    // Tryb demo
    if (!isSupabaseConfigured()) {
      toast({
        title: "Sukces",
        description: "Profil zaktualizowany pomyślnie (tryb demo).",
      });
      return;
    }

    try {
      // Aktualizacja danych organizacji w Supabase
      if (organizationId) {
        const { error } = await supabase
          .from('organizations')
          .update({
            name: data.organizationName,
            description: data.description,
            address: data.location,
            contact_email: data.email,
            phone: data.phone,
            website: data.website,
            updated_at: new Date().toISOString(),
          })
          .eq('id', organizationId);

        if (error) {
          console.error('Błąd podczas aktualizacji organizacji:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się zaktualizować profilu organizacji.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Sukces",
          description: "Profil organizacji został zaktualizowany.",
        });
      }
    } catch (error) {
      console.error('Nieoczekiwany błąd:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji profilu.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganization) {
    return null; // Już nawigujemy do innej strony w useEffect
  }

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Profil organizacji</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informacje o profilu</CardTitle>
                <CardDescription>
                  Zarządzaj danymi kontaktowymi i profilowymi swojej organizacji.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={avatarUrl || ''} alt="Logo organizacji" />
                  <AvatarFallback className="text-3xl">
                    {form.getValues("organizationName").substring(0, 2) || 'OR'}
                  </AvatarFallback>
                </Avatar>
                
                <Button variant="outline" className="mb-2">
                  Zmień logo
                </Button>
                
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wskazówka</AlertTitle>
                  <AlertDescription>
                    Uzupełnij wszystkie informacje, aby zwiększyć widoczność Twojej organizacji.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dane organizacji</CardTitle>
                <CardDescription>
                  Te informacje będą widoczne na profilu Twojej organizacji.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa organizacji</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                              <Building className="ml-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="Nazwa organizacji" 
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                {...field} 
                              />
                            </div>
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
                          <FormLabel>Opis organizacji</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Napisz krótki opis swojej organizacji..." 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Opisz czym zajmuje się Twoja organizacja i jakie ma cele.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokalizacja</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                                <MapPin className="ml-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Miasto, województwo" 
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email kontaktowy</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                                <Mail className="ml-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="kontakt@organizacja.pl" 
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                                <Phone className="ml-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="+48 123 456 789" 
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strona internetowa</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                                <Globe className="ml-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="https://organizacja.pl" 
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-ngo hover:bg-ngo/90">
                        <Save className="mr-2 h-4 w-4" />
                        Zapisz zmiany
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
