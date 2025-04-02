
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useOrganizationStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadLogo = async (file: File, organizationId: string) => {
    if (!file || !organizationId) {
      toast({
        title: "Błąd",
        description: "Brak pliku lub identyfikatora organizacji",
        variant: "destructive",
      });
      throw new Error('No file or organization ID provided');
    }

    if (!isSupabaseConfigured()) {
      // Return a fake URL for demo mode
      toast({
        title: "Tryb demo",
        description: "W trybie demo, zdjęcie jest symulowane",
      });
      return { url: URL.createObjectURL(file) };
    }

    try {
      setUploading(true);
      
      console.log('Rozpoczęcie przesyłania logo dla organizacji:', organizationId);

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Nieprawidłowy format",
          description: "Dozwolone formaty to: JPG, PNG, GIF, WEBP",
          variant: "destructive",
        });
        throw new Error('Invalid file type');
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Plik zbyt duży",
          description: "Maksymalny rozmiar pliku to 2MB",
          variant: "destructive",
        });
        throw new Error('File too large');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${organizationId}/logo.${fileExt}`;
      
      console.log('Przesyłanie pliku do ścieżki:', filePath);
      
      const { error: uploadError, data } = await supabase.storage
        .from('organizations')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Błąd podczas przesyłania:', uploadError);
        throw uploadError;
      }

      console.log('Plik przesłany pomyślnie, pobieranie URL publicznego');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organizations')
        .getPublicUrl(filePath);

      console.log('Publiczny URL:', publicUrl);

      // Update organization logo URL in the database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ logo_url: publicUrl })
        .eq('id', organizationId);

      if (updateError) {
        console.error('Błąd podczas aktualizacji URL logo:', updateError);
        throw updateError;
      }

      toast({
        title: "Sukces",
        description: "Logo zostało zaktualizowane pomyślnie",
      });

      return { url: publicUrl };
    } catch (error) {
      console.error('Błąd przesyłania logo:', error);
      toast({
        title: "Błąd przesyłania",
        description: "Nie udało się przesłać logo. Spróbuj ponownie później.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadLogo,
    uploading
  };
};
