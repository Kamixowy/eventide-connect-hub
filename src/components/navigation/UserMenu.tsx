
import { Link } from 'react-router-dom';
import { LogOut, Calendar, MessageSquare, UserCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const UserMenu = () => {
  const {
    user,
    signOut
  } = useAuth();
  
  const [profileData, setProfileData] = useState<any>(null);
  const isOrganization = user?.user_metadata?.userType === 'organization';
  const isSponsor = user?.user_metadata?.userType === 'sponsor';
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          if (data) setProfileData(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, [user]);
  
  if (!user) return null;
  
  // Use avatar_url from profile if available, otherwise from user metadata
  const avatarUrl = profileData?.avatar_url || user.user_metadata?.avatar_url || '';
  const userName = user.user_metadata?.name || profileData?.name || 'Użytkownik';
  
  const handleSignOut = () => {
    // Call signOut directly without any event parameters
    signOut();
  };
  
  return <div className="flex items-center gap-2">
      <Link to="/wiadomosci" className="hidden md:inline-flex">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>{userName?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {user.user_metadata?.userType === 'organization' ? 'Organizacja' : 'Sponsor'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profil" className="cursor-pointer w-full flex">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Mój profil</span>
            </Link>
          </DropdownMenuItem>
          {isOrganization && <>
              <DropdownMenuItem asChild>
                <Link to="/profil" className="cursor-pointer w-full flex">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Moja organizacja</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/moje-wydarzenia" className="cursor-pointer w-full flex">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Moje wydarzenia</span>
                </Link>
              </DropdownMenuItem>
            </>}
          {isSponsor && (
            <DropdownMenuItem asChild>
              <Link to="/moje-wsparcia" className="cursor-pointer w-full flex">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Moje wsparcia</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/wiadomosci" className="cursor-pointer w-full flex md:hidden">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Wiadomości</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Wyloguj się</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
};

export default UserMenu;
