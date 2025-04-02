
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/cc2bd95f-af69-4190-9085-eddc4d7750fa.png" 
                alt="N-GO Logo" 
                className="h-10 w-auto" 
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Platforma łącząca organizacje z potencjalnymi sponsorami wydarzeń.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Strona</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link to="/wydarzenia" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Wydarzenia
                </Link>
              </li>
              <li>
                <Link to="/organizacje" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Organizacje
                </Link>
              </li>
              <li>
                <Link to="/o-nas" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  O nas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Wsparcie</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/wsparcie" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Centrum wsparcia
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Informacje prawne</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/polityka-prywatnosci" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link to="/regulamin" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link to="/cookie" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Polityka cookie
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-muted-foreground text-sm">
          <p>© {currentYear} N-GO. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
