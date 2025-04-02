
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isOpen, setIsOpen }: MobileMenuProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <NavLinks mobileView={true} />
              
              {!user && <AuthButtons mobileView={true} />}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
