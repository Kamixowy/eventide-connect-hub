
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
    const filePath = `event-banners/${fileName}`;
    
    console.log('Uploading file to Supabase Storage bucket "events"');
    
    // Upload to the "events" bucket
    const { error: uploadError, data } = await supabase.storage
      .from('events')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully, getting public URL');
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('events')
      .getPublicUrl(filePath);
      
    console.log('Public URL obtained:', urlData.publicUrl);
    
    return urlData.publicUrl;
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
