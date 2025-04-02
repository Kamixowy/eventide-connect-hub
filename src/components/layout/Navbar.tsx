import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  User, 
  Calendar, 
  MessageSquare, 
  Briefcase, 
  ChevronDown,
  Info,
  Contact as ContactIcon,
  Users,
  ListChecks
} from 'lucide-react';
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const isOrganization = user?.user_metadata?.userType === 'organization';
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      } transition-all duration-200`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-ngo">N-GO</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/wydarzenia" 
              className={`text-sm font-medium transition-colors hover:text-ngo ${
                isActive('/wydarzenia') ? 'text-ngo' : 'text-muted-foreground'
              }`}
            >
              Wydarzenia
            </Link>
            <Link 
              to="/organizacje" 
              className={`text-sm font-medium transition-colors hover:text-ngo ${
                isActive('/organizacje') ? 'text-ngo' : 'text-muted-foreground'
              }`}
            >
              Organizacje
            </Link>
            {user && isOrganization && (
              <Link 
                to="/moje-wydarzenia" 
                className={`text-sm font-medium transition-colors hover:text-ngo ${
                  isActive('/moje-wydarzenia') ? 'text-ngo' : 'text-muted-foreground'
                }`}
              >
                Moje wydarzenia
              </Link>
            )}
            {user && (
              <Link 
                to="/wspolprace" 
                className={`text-sm font-medium transition-colors hover:text-ngo ${
                  isActive('/wspolprace') ? 'text-ngo' : 'text-muted-foreground'
                }`}
              >
                Współprace
              </Link>
            )}
            {!user && (
              <>
                <Link 
                  to="/o-nas" 
                  className={`text-sm font-medium transition-colors hover:text-ngo ${
                    isActive('/o-nas') ? 'text-ngo' : 'text-muted-foreground'
                  }`}
                >
                  O nas
                </Link>
                <Link 
                  to="/kontakt" 
                  className={`text-sm font-medium transition-colors hover:text-ngo ${
                    isActive('/kontakt') ? 'text-ngo' : 'text-muted-foreground'
                  }`}
                >
                  Kontakt
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? (
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
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/logowanie">
                  <Button variant="ghost">
                    <LogIn className="mr-2 h-4 w-4" />
                    Zaloguj się
                  </Button>
                </Link>
                <Link to="/rejestracja">
                  <Button className="btn-gradient">
                    Zarejestruj się
                  </Button>
                </Link>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/wydarzenia" 
                className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                  isActive('/wydarzenia') ? 'text-ngo' : 'text-muted-foreground'
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Wydarzenia
              </Link>
              <Link 
                to="/organizacje" 
                className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                  isActive('/organizacje') ? 'text-ngo' : 'text-muted-foreground'
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Organizacje
              </Link>
              {user && isOrganization && (
                <Link 
                  to="/moje-wydarzenia" 
                  className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                    isActive('/moje-wydarzenia') ? 'text-ngo' : 'text-muted-foreground'
                  }`}
                >
                  <ListChecks className="mr-2 h-5 w-5" />
                  Moje wydarzenia
                </Link>
              )}
              {user && (
                <Link 
                  to="/wspolprace" 
                  className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                    isActive('/wspolprace') ? 'text-ngo' : 'text-muted-foreground'
                  }`}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Współprace
                </Link>
              )}
              {!user && (
                <>
                  <Link 
                    to="/o-nas" 
                    className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                      isActive('/o-nas') ? 'text-ngo' : 'text-muted-foreground'
                    }`}
                  >
                    <Info className="mr-2 h-5 w-5" />
                    O nas
                  </Link>
                  <Link 
                    to="/kontakt" 
                    className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                      isActive('/kontakt') ? 'text-ngo' : 'text-muted-foreground'
                    }`}
                  >
                    <ContactIcon className="mr-2 h-5 w-5" />
                    Kontakt
                  </Link>
                </>
              )}
              {user && (
                <Link 
                  to="/wiadomosci" 
                  className={`flex items-center py-2 text-base font-medium transition-colors hover:text-ngo ${
                    isActive('/wiadomosci') ? 'text-ngo' : 'text-muted-foreground'
                  }`}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Wiadomości
                </Link>
              )}
              
              {!user && (
                <div className="pt-2 space-y-3">
                  <Link to="/logowanie" className="w-full">
                    <Button variant="outline" className="w-full justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Zaloguj się
                    </Button>
                  </Link>
                  <Link to="/rejestracja" className="w-full">
                    <Button className="w-full justify-center btn-gradient">
                      Zarejestruj się
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
