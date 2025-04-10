
import { Info, Calendar, Briefcase, ContactIcon, Users, ListChecks, MessageSquare, PlusCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavLink from './NavLink';

interface NavLinksProps {
  mobileView?: boolean;
}

const NavLinks = ({ mobileView = false }: NavLinksProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  
  const isOrganization = user?.user_metadata?.userType === 'organization';
  
  return (
    <>
      <NavLink 
        to="/wydarzenia" 
        isActive={isActive('/wydarzenia')}
        mobileView={mobileView}
      >
        {mobileView && <Calendar className="mr-2 h-5 w-5" />}
        Wydarzenia
      </NavLink>
      
      <NavLink 
        to="/organizacje" 
        isActive={isActive('/organizacje')}
        mobileView={mobileView}
      >
        {mobileView && <Users className="mr-2 h-5 w-5" />}
        Organizacje
      </NavLink>
      
      {user && isOrganization && mobileView && (
        <>
          <NavLink 
            to="/dodaj-wydarzenie" 
            isActive={isActive('/dodaj-wydarzenie')}
            mobileView={true}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Dodaj wydarzenie
          </NavLink>
          
          <NavLink 
            to="/moje-wydarzenia" 
            isActive={isActive('/moje-wydarzenia')}
            mobileView={mobileView}
          >
            {mobileView && <ListChecks className="mr-2 h-5 w-5" />}
            Moje wydarzenia
          </NavLink>
        </>
      )}
      
      {user && (
        <NavLink 
          to="/wspolprace" 
          isActive={isActive('/wspolprace')}
          mobileView={mobileView}
        >
          {mobileView && <Briefcase className="mr-2 h-5 w-5" />}
          Współprace
        </NavLink>
      )}
      
      {!user && (
        <>
          <NavLink 
            to="/o-nas" 
            isActive={isActive('/o-nas')}
            mobileView={mobileView}
          >
            {mobileView && <Info className="mr-2 h-5 w-5" />}
            O nas
          </NavLink>
          
          <NavLink 
            to="/kontakt" 
            isActive={isActive('/kontakt')}
            mobileView={mobileView}
          >
            {mobileView && <ContactIcon className="mr-2 h-5 w-5" />}
            Kontakt
          </NavLink>
        </>
      )}
      
      {user && mobileView && (
        <NavLink 
          to="/wiadomosci" 
          isActive={isActive('/wiadomosci')}
          mobileView={true}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Wiadomości
        </NavLink>
      )}
    </>
  );
};

export default NavLinks;
