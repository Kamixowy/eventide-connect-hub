
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  scrollToTop?: boolean;
  preventScroll?: boolean;
}

const Layout = ({ children, scrollToTop = true, preventScroll = false }: LayoutProps) => {
  useEffect(() => {
    // Only scroll to top if explicitly requested and not preventing scroll
    if (scrollToTop && !preventScroll) {
      window.scrollTo(0, 0);
    }

    if (preventScroll) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [scrollToTop, preventScroll]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
