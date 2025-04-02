
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  mobileView?: boolean;
}

const AuthButtons = ({ mobileView = false }: AuthButtonsProps) => {
  if (mobileView) {
    return (
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
    );
  }
  
  return (
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
  );
};

export default AuthButtons;
