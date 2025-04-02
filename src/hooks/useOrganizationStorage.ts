
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useOrganizationStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadLogo = async (file: File, organizationId: string) => {
    if (!file || !organizationId) {
      throw new Error('No file or organization ID provided');
    }

    if (!isSupabaseConfigured()) {
      // Return a fake URL for demo mode
      return { url: URL.createObjectURL(file) };
    }

    try {
      setUploading(true);

      // Check if organizations bucket exists
      try {
        const { data: bucket } = await supabase.storage.getBucket('organizations');
        if (!bucket) {
          // Create bucket if it doesn't exist
          await supabase.storage.createBucket('organizations', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
          });
        }
      } catch (bucketError) {
        console.log('Bucket check error, trying to create:', bucketError);
        await supabase.storage.createBucket('organizations', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `organizations/${organizationId}/logo.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('organizations')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organizations')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error('Error uploading logo:', error);
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
