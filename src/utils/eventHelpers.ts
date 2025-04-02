
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Function to upload image to Supabase storage
export const uploadEventImage = async (file: File): Promise<string | null> => {
  try {
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      throw new Error('Nieprawidłowy format pliku. Dozwolone formaty: JPG, PNG, GIF, WEBP');
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Plik jest zbyt duży. Maksymalny rozmiar to 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Check if the event_images bucket exists, if not create it
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
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    let errorMessage = 'Nie udało się przesłać zdjęcia. Spróbuj ponownie.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Błąd",
      description: errorMessage,
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
