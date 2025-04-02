
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Function to upload image to Supabase storage
export const uploadEventImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `event_images/${fileName}`;
    
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
      
    toast({
      title: "Zdjęcie przesłane",
      description: "Zdjęcie zostało pomyślnie przesłane.",
    });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast({
      title: "Błąd",
      description: "Nie udało się przesłać zdjęcia. Spróbuj ponownie.",
      variant: "destructive"
    });
    return null;
  }
};

// Convert array fields from comma-separated strings
export const processArrayFields = (value: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};
