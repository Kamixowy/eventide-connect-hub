
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

const formSchema = z.object({
  address: z.string().optional(),
  contact_email: z.string().email({
    message: 'Podaj poprawny adres email',
  }).optional(),
  phone: z.string().optional(),
  website: z.string().url({
    message: 'Podaj poprawny adres strony internetowej',
  }).optional().or(z.literal('')),
});

const OrganizationContactForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      contact_email: '',
      phone: '',
      website: '',
    },
  });

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('address, contact_email, phone, website')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching organization data:', error);
          return;
        }

        if (data) {
          form.reset({
            address: data.address || '',
            contact_email: data.contact_email || '',
            phone: data.phone || '',
            website: data.website || '',
          });
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
          address: values.address,
          contact_email: values.contact_email,
          phone: values.phone,
          website: values.website,
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sukces',
        description: 'Informacje kontaktowe zostały zaktualizowane',
      });
    } catch (error) {
      console.error('Error updating contact data:', error);
      toast({
        variant: 'destructive',
        title: 'Błąd',
        description: 'Nie udało się zaktualizować informacji kontaktowych',
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
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Input placeholder="Adres organizacji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email kontaktowy</FormLabel>
              <FormControl>
                <Input type="email" placeholder="kontakt@organizacja.pl" {...field} />
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
                <Input type="tel" placeholder="Numer telefonu" {...field} />
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
                <Input placeholder="https://www.organizacja.pl" {...field} />
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

export default OrganizationContactForm;
