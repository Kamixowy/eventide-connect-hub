
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

interface ProfileAvatarProps {
  user: any;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const ProfileAvatar = ({ user, avatarUrl, setAvatarUrl }: ProfileAvatarProps) => {
  const { loading, handleAvatarUpload } = useAvatarUpload({
    user,
    initialAvatarUrl: avatarUrl,
    onAvatarChange: setAvatarUrl
  });

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
