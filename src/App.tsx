
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CookieConsent from './components/common/CookieConsent';

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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="container py-8">Ładowanie...</div>;
  }
  
  if (!user) {
    return <Navigate to="/logowanie" replace />;
  }
  
  return <>{children}</>;
};

// Organization-only route component
const OrganizationRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const isOrganization = user?.user_metadata?.userType === 'organization';
  
  if (loading) {
    return <div className="container py-8">Ładowanie...</div>;
  }
  
  if (!user) {
    return <Navigate to="/logowanie" replace />;
  }
  
  if (!isOrganization) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

function AppRoutes() {
  return (
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
      
      {/* Protected routes requiring authentication */}
      <Route path="/dodaj-wydarzenie" element={
        <OrganizationRoute>
          <AddEvent />
        </OrganizationRoute>
      } />
      <Route path="/edytuj-wydarzenie/:id" element={
        <OrganizationRoute>
          <EditEvent />
        </OrganizationRoute>
      } />
      <Route path="/moje-wydarzenia" element={
        <OrganizationRoute>
          <MyEvents />
        </OrganizationRoute>
      } />
      <Route path="/profil" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/uzytkownicy/:id" element={<UserProfile />} />
      <Route path="/wspolprace" element={
        <ProtectedRoute>
          <Collaborations />
        </ProtectedRoute>
      } />
      <Route path="/wspolprace/:id" element={
        <ProtectedRoute>
          <CollaborationDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/wiadomosci" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/moje-wsparcia" element={
        <ProtectedRoute>
          <Collaborations />
        </ProtectedRoute>
      } />
      
      {/* Legal pages */}
      <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
      <Route path="/regulamin" element={<TermsConditions />} />
      <Route path="/polityka-cookie" element={<CookiePolicy />} />
      <Route path="/faq" element={<FAQ />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
