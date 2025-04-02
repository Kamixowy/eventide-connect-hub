
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Mail, 
  Globe, 
  Phone, 
  Save, 
  Building,
  AlertCircle,
  Upload,
  Tag,
  Award
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
  category: z.string().optional(),
  achievements: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOrganization, setIsOrganization] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      organizationName: '',
      description: '',
      location: '',
      email: '',
      phone: '',
      website: '',
      category: '',
      achievements: '',
    },
  });

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

    const fetchOrganizationData = async () => {
      if (!isSupabaseConfigured() || !user) {
        setLoading(false);
        form.reset({
          organizationName: user.user_metadata?.name || 'Demo Organizacja',
          description: 'Opis demo organizacji',
          location: 'Warszawa',
          email: user.email || 'demo@example.com',
          phone: '+48 123 456 789',
          website: 'https://example.com',
          category: 'Pomoc społeczna',
          achievements: 'Nagroda "Organizacja Roku 2022"',
        });
        return;
      }

      try {
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
          // Define the expected type for the organization data
          interface OrganizationDBData {
            id: string;
            name: string;
            description: string | null;
            address: string | null;
            contact_email: string | null;
            phone: string | null;
            website: string | null;
            logo_url: string | null;
            user_id: string;
            category: string | null;
            achievements: string[] | null;
            created_at: string;
            updated_at: string;
          }

          // Cast the data to the expected type
          const typedOrgData = orgData as unknown as OrganizationDBData;
          
          setOrganizationId(typedOrgData.id);
          form.reset({
            organizationName: typedOrgData.name || '',
            description: typedOrgData.description || '',
            location: typedOrgData.address || '',
            email: typedOrgData.contact_email || user.email || '',
            phone: typedOrgData.phone || '',
            website: typedOrgData.website || '',
            category: typedOrgData.category || '',
            achievements: Array.isArray(typedOrgData.achievements) 
              ? typedOrgData.achievements.join('\n') 
              : (typedOrgData.achievements || ''),
          });
          setAvatarUrl(typedOrgData.logo_url);
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

    if (!isSupabaseConfigured()) {
      toast({
        title: "Sukces",
        description: "Profil zaktualizowany pomyślnie (tryb demo).",
      });
      return;
    }

    try {
      if (organizationId) {
        const achievementsArray = data.achievements
          ? data.achievements.split('\n').filter(item => item.trim() !== '')
          : [];

        const { error } = await supabase
          .from('organizations')
          .update({
            name: data.organizationName,
            description: data.description,
            address: data.location,
            contact_email: data.email,
            phone: data.phone,
            website: data.website,
            category: data.category,
            achievements: achievementsArray,
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

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organizationId) return;

    if (!isSupabaseConfigured()) {
      setAvatarUrl(URL.createObjectURL(file));
      toast({
        title: "Sukces",
        description: "Zdjęcie profilowe zaktualizowane (tryb demo).",
      });
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `organizations/${organizationId}/logo.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('organizations')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('organizations')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('organizations')
        .update({ logo_url: publicUrl })
        .eq('id', organizationId);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast({
        title: "Sukces",
        description: "Zdjęcie profilowe zostało zaktualizowane.",
      });
    } catch (error) {
      console.error('Błąd podczas przesyłania zdjęcia:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować zdjęcia profilowego.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOrganization) {
    return null;
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Avatar 
                  className="h-32 w-32 mb-4 cursor-pointer hover:opacity-80 transition-opacity relative"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarUrl || ''} alt="Logo organizacji" />
                  <AvatarFallback className="text-3xl relative">
                    {form.getValues("organizationName").substring(0, 2) || 'OR'}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </Avatar>
                
                <Button 
                  variant="outline" 
                  className="mb-2"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                >
                  {uploading ? 'Przesyłanie...' : 'Zmień logo'}
                </Button>
                
                {organizationId && (
                  <Link to={`/organizacje/${organizationId}`}>
                    <Button variant="link" className="mb-2">
                      Zobacz publiczny profil
                    </Button>
                  </Link>
                )}
                
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dziedzina działalności</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                              <Tag className="ml-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="np. Pomoc społeczna, Edukacja, Ochrona środowiska" 
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Określ główną dziedzinę działalności Twojej organizacji.
                          </FormDescription>
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

                    <FormField
                      control={form.control}
                      name="achievements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Osiągnięcia</FormLabel>
                          <FormControl>
                            <div className="flex items-start border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                              <Award className="ml-3 mt-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <Textarea 
                                placeholder="Wpisz każde osiągnięcie w nowej linii..." 
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[120px]" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Wpisz każde osiągnięcie w nowej linii. Np. nagrody, wyróżnienia, zrealizowane projekty.
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
