
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  scrollToTop?: boolean;
}

const Layout = ({ children, scrollToTop = true }: LayoutProps) => {
  // Only scroll to top if explicitly requested
  if (scrollToTop) {
    window.scrollTo(0, 0);
  }

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
