
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarProps {
  user: any;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const ProfileAvatar = ({ user, avatarUrl, setAvatarUrl }: ProfileAvatarProps) => {
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
        
        toast({
          title: 'Tryb demo',
          description: 'W trybie demo avatar zostanie zmieniony tylko tymczasowo',
          variant: 'default',
        });
        setLoading(false);
        return;
      }
      
      // Implement real avatar upload to Supabase Storage
      const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Check if 'avatars' bucket exists, if not create one (normally this should be done on backend setup)
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
      
      if (!avatarBucket) {
        // Create avatars bucket if it doesn't exist
        const { error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          throw new Error('Nie można utworzyć miejsca na avatary');
        }
      }
      
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
        
      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        throw updateError;
      }
      
      toast({
        title: 'Avatar zaktualizowany',
        description: 'Twój avatar został pomyślnie zaktualizowany',
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Błąd przesyłania',
        description: 'Nie udało się przesłać avatara. Spróbuj ponownie później.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-32 w-32 mb-4">
        <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'User'} />
        <AvatarFallback className="text-4xl">
          {user.user_metadata?.name?.substring(0, 2) || user.email?.substring(0, 2) || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <div className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-md text-sm transition-colors">
          <Upload size={16} />
          <span>Zmień avatar</span>
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
          disabled={loading}
        />
      </label>
    </div>
  );
};

export default ProfileAvatar;
