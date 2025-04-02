
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadEventImage } from '@/utils/eventHelpers';

export const useEventImageUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      setUploading(true);
      toast({
        title: "Przesyłanie",
        description: "Trwa przesyłanie zdjęcia...",
      });
      
      console.log('Starting image upload in useEventImageUpload hook');
      const imageUrl = await uploadEventImage(file);
      
      if (imageUrl) {
        console.log('Image upload successful, URL:', imageUrl);
        setUploadedImageUrl(imageUrl);
        toast({
          title: "Sukces",
          description: "Zdjęcie zostało przesłane pomyślnie.",
        });
      } else {
        throw new Error("Nie udało się przesłać zdjęcia");
      }
    } catch (error) {
      console.error('Error uploading image in hook:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadedImageUrl,
    setUploadedImageUrl,
    uploading,
    handleImageUpload,
  };
};
