
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  logo_url: z.string().optional(),
  cover_url: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
});

const OrganizationMediaForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo_url: '',
      cover_url: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('logo_url, cover_url, social_media')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching organization data:', error);
          return;
        }

        if (data) {
          const socialMedia = data.social_media || {};
          
          form.reset({
            logo_url: data.logo_url || '',
            cover_url: data.cover_url || '',
            facebook: socialMedia.facebook || '',
            twitter: socialMedia.twitter || '',
            instagram: socialMedia.instagram || '',
            linkedin: socialMedia.linkedin || '',
          });
          
          setLogoPreview(data.logo_url || '');
          setCoverPreview(data.cover_url || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchOrganizationData();
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          logo_url: values.logo_url,
          cover_url: values.cover_url,
          social_media: {
            facebook: values.facebook || null,
            twitter: values.twitter || null,
            instagram: values.instagram || null,
            linkedin: values.linkedin || null,
          }
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sukces',
        description: 'Informacje o mediach zostały zaktualizowane',
      });
    } catch (error) {
      console.error('Error updating media data:', error);
      toast({
        variant: 'destructive',
        title: 'Błąd',
        description: 'Nie udało się zaktualizować informacji o mediach',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <p className="text-sm text-muted-foreground">Ładowanie danych...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="URL do logo organizacji" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setLogoPreview(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={logoPreview} alt="Logo podgląd" />
              <AvatarFallback className="text-lg">Logo</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="cover_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zdjęcie w tle (URL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="URL do zdjęcia w tle" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setCoverPreview(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center items-center">
            {coverPreview && (
              <div className="w-32 h-24 overflow-hidden rounded">
                <img 
                  src={coverPreview} 
                  alt="Cover podgląd" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Cover';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium pt-2">Social Media</h3>
        
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input placeholder="https://facebook.com/twoja-organizacja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter</FormLabel>
              <FormControl>
                <Input placeholder="https://twitter.com/twoja-organizacja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="https://instagram.com/twoja-organizacja" {...field} />
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
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/company/twoja-organizacja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationMediaForm;
