
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseAvatarUploadProps {
  user: any;
  initialAvatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export const useAvatarUpload = ({ 
  user, 
  initialAvatarUrl, 
  onAvatarChange 
}: UseAvatarUploadProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Nieprawidłowy format pliku',
        description: 'Proszę wybrać plik graficzny (JPG, PNG, GIF)',
        variant: 'destructive',
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Plik jest za duży',
        description: 'Maksymalny rozmiar pliku to 2MB',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (localStorage.getItem('demoUser')) {
        const tempUrl = URL.createObjectURL(file);
        setAvatarUrl(tempUrl);
        onAvatarChange(tempUrl);
        
        toast({
          title: 'Tryb demo',
          description: 'W trybie demo avatar zostanie zmieniony tylko tymczasowo',
          variant: 'default',
        });
        setLoading(false);
        return;
      }
      
      // Upload to Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload the file to storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      setAvatarUrl(publicUrl);
      onAvatarChange(publicUrl);
        
      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        throw updateError;
      }
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Don't throw here, as the user metadata is already updated
      }
      
      toast({
        title: 'Avatar zaktualizowany',
        description: 'Twój avatar został pomyślnie zaktualizowany',
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Błąd przesyłania',
        description: error.message || 'Nie udało się przesłać avatara. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    avatarUrl,
    loading,
    handleAvatarUpload
  };
};
