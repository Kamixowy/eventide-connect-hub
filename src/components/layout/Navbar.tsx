import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from '../navigation/NavLinks';
import UserMenu from '../navigation/UserMenu';
import AuthButtons from '../navigation/AuthButtons';
import MobileMenu from '../navigation/MobileMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
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
          
          <nav className="hidden md:flex items-center justify-center space-x-6">
            <NavLinks />
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? <UserMenu /> : <AuthButtons />}
            
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
