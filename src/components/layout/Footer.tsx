
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">O platformie</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/o-nas" className="text-gray-300 hover:text-white transition">
                  O nas
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-gray-300 hover:text-white transition">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Dla organizacji</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dodaj-wydarzenie" className="text-gray-300 hover:text-white transition">
                  Dodaj wydarzenie
                </Link>
              </li>
              <li>
                <Link to="/moje-wydarzenia" className="text-gray-300 hover:text-white transition">
                  Moje wydarzenia
                </Link>
              </li>
              <li>
                <Link to="/wspolprace" className="text-gray-300 hover:text-white transition">
                  Współprace
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Dla sponsorów</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/wydarzenia" className="text-gray-300 hover:text-white transition">
                  Przeglądaj wydarzenia
                </Link>
              </li>
              <li>
                <Link to="/organizacje" className="text-gray-300 hover:text-white transition">
                  Organizacje
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Informacje prawne</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/regulamin" className="text-gray-300 hover:text-white transition">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link to="/polityka-prywatnosci" className="text-gray-300 hover:text-white transition">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link to="/polityka-cookie" className="text-gray-300 hover:text-white transition">
                  Polityka cookie
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} Nazwa platformy. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
