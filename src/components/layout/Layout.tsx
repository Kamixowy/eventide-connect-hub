
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
      // Save current scroll position
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // Create event handlers for different types of scroll events
      const preventDefaultScroll = (e: Event) => {
        e.preventDefault();
      };

      const maintainScroll = () => {
        window.scrollTo(scrollX, scrollY);
      };

      // Disable various events that could cause scrolling
      document.addEventListener('wheel', preventDefaultScroll, { passive: false });
      document.addEventListener('touchmove', preventDefaultScroll, { passive: false });
      document.addEventListener('scroll', maintainScroll);

      return () => {
        // Clean up event listeners when component unmounts
        document.removeEventListener('wheel', preventDefaultScroll);
        document.removeEventListener('touchmove', preventDefaultScroll);
        document.removeEventListener('scroll', maintainScroll);
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
