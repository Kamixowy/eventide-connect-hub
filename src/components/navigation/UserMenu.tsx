
import { Link } from 'react-router-dom';
import { LogOut, User, Calendar, MessageSquare, Briefcase, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const isOrganization = user?.user_metadata?.userType === 'organization';
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Link to="/wiadomosci" className="hidden md:inline-flex">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.user_metadata?.name || 'User'} />
              <AvatarFallback>{user.user_metadata?.name?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata?.name || 'Użytkownik'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {user.user_metadata?.userType === 'organization' ? 'Organizacja' : 'Sponsor'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profil" className="cursor-pointer w-full flex">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/wydarzenia" className="cursor-pointer w-full flex">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Wydarzenia</span>
            </Link>
          </DropdownMenuItem>
          {isOrganization && (
            <DropdownMenuItem asChild>
              <Link to="/moje-wydarzenia" className="cursor-pointer w-full flex">
                <ListChecks className="mr-2 h-4 w-4" />
                <span>Moje wydarzenia</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/wiadomosci" className="cursor-pointer w-full flex md:hidden">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Wiadomości</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/wspolprace" className="cursor-pointer w-full flex">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Współprace</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Wyloguj się</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
