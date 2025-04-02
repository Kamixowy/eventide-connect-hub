
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/logowanie">
            <Button variant="outline">Zaloguj się</Button>
          </Link>
          <Link to="/rejestracja">
            <Button className="btn-gradient">Zarejestruj się</Button>
          </Link>
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
            
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/logowanie" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Zaloguj się</Button>
              </Link>
              <Link to="/rejestracja" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full btn-gradient">Zarejestruj się</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
