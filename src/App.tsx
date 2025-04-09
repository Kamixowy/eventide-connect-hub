
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Organizations from './pages/Organizations';
import OrganizationProfile from './pages/OrganizationProfile';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Collaborations from './pages/Collaborations';
import CollaborationDetailsPage from './pages/CollaborationDetailsPage';
import Messages from './pages/Messages';

// New legal pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CookiePolicy from './pages/CookiePolicy';
import FAQ from './pages/FAQ';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/o-nas" element={<About />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/logowanie" element={<Login />} />
              <Route path="/rejestracja" element={<Register />} />
              <Route path="/organizacje" element={<Organizations />} />
              <Route path="/organizacje/:id" element={<OrganizationProfile />} />
              <Route path="/wydarzenia" element={<EventsList />} />
              <Route path="/wydarzenia/:id" element={<EventDetails />} />
              <Route path="/dodaj-wydarzenie" element={<AddEvent />} />
              <Route path="/edytuj-wydarzenie/:id" element={<EditEvent />} />
              <Route path="/moje-wydarzenia" element={<MyEvents />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/uzytkownicy/:id" element={<UserProfile />} />
              <Route path="/wspolprace" element={<Collaborations />} />
              <Route path="/wspolprace/:id" element={<CollaborationDetailsPage />} />
              <Route path="/wiadomosci" element={<Messages />} />
              
              {/* Legal pages */}
              <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
              <Route path="/regulamin" element={<TermsConditions />} />
              <Route path="/polityka-cookie" element={<CookiePolicy />} />
              <Route path="/faq" element={<FAQ />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
