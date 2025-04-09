
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
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Nazwa organizacji musi mieć co najmniej 3 znaki',
  }),
  description: z.string().min(10, {
    message: 'Opis powinien mieć co najmniej 10 znaków',
  }),
  category: z.string().min(2, {
    message: 'Podaj kategorię organizacji',
  }),
  nip: z.string().optional(),
  foundingDate: z.string().optional(),
});

const OrganizationBasicInfoForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      nip: '',
      foundingDate: '',
    },
  });

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('name, description, category, nip, founding_date')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching organization data:', error);
          return;
        }

        if (data) {
          form.reset({
            name: data.name || '',
            description: data.description || '',
            category: data.category || '',
            nip: data.nip || '',
            foundingDate: data.founding_date 
              ? format(new Date(data.founding_date), 'yyyy-MM-dd')
              : '',
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
          name: values.name,
          description: values.description,
          category: values.category,
          nip: values.nip,
          founding_date: values.foundingDate || null,
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Sukces',
        description: 'Informacje o organizacji zostały zaktualizowane',
      });
    } catch (error) {
      console.error('Error updating organization data:', error);
      toast({
        variant: 'destructive',
        title: 'Błąd',
        description: 'Nie udało się zaktualizować informacji o organizacji',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa organizacji</FormLabel>
              <FormControl>
                <Input placeholder="Nazwa Twojej organizacji" {...field} />
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
                  placeholder="Opisz czym zajmuje się Twoja organizacja" 
                  className="resize-y min-h-[120px]"
                  {...field} 
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
                <Input placeholder="np. Ochrona środowiska, Pomoc społeczna" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP (opcjonalnie)</FormLabel>
                <FormControl>
                  <Input placeholder="NIP organizacji" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foundingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data założenia (opcjonalnie)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationBasicInfoForm;
