
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
  mobileView?: boolean;
}

const NavLink = ({ to, isActive, children, className, mobileView = false }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        `text-sm font-medium transition-colors hover:text-ngo`,
        mobileView ? 'flex items-center py-2 text-base' : '',
        isActive ? 'text-ngo' : 'text-muted-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
