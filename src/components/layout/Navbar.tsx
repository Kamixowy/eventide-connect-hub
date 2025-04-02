
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userName = user?.user_metadata?.name || user?.email || '';
  const userType = user?.user_metadata?.userType;
  const userInitials = userName ? getInitials(userName) : 'NG';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/cc2bd95f-af69-4190-9085-eddc4d7750fa.png" 
            alt="N-GO Logo" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/wydarzenia" className="text-foreground/80 hover:text-foreground transition-colors">
            Wydarzenia
          </Link>
          <Link to="/organizacje" className="text-foreground/80 hover:text-foreground transition-colors">
            Organizacje
          </Link>
          <Link to="/o-nas" className="text-foreground/80 hover:text-foreground transition-colors">
            O nas
          </Link>
          <Link to="/kontakt" className="text-foreground/80 hover:text-foreground transition-colors">
            Kontakt
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {userType === 'organization' && (
                <Link to="/dodaj-wydarzenie">
                  <Button variant="outline">Dodaj wydarzenie</Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {userType === 'organization' ? 'Organizacja' : 'Sponsor'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profil" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wiadomosci" className="flex w-full cursor-pointer items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Wiadomości</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wspolprace" className="flex w-full cursor-pointer items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Współprace</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Wyloguj się</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/logowanie">
                <Button variant="outline">Zaloguj się</Button>
              </Link>
              <Link to="/rejestracja">
                <Button className="btn-gradient">Zarejestruj się</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden p-4 pt-0 bg-background border-b animate-fade-in">
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              to="/wydarzenia" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Wydarzenia
            </Link>
            <Link 
              to="/organizacje" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Organizacje
            </Link>
            <Link 
              to="/o-nas" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              O nas
            </Link>
            <Link 
              to="/kontakt" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
            
            {user ? (
              <div className="pt-4 flex flex-col space-y-3">
                {userType === 'organization' && (
                  <Link to="/dodaj-wydarzenie" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Dodaj wydarzenie</Button>
                  </Link>
                )}
                <Link to="/profil" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Button>
                </Link>
                <Link to="/wiadomosci" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Wiadomości
                  </Button>
                </Link>
                <Link to="/wspolprace" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Współprace
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Wyloguj się
                </Button>
              </div>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/logowanie" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Zaloguj się</Button>
                </Link>
                <Link to="/rejestracja" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full btn-gradient">Zarejestruj się</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
