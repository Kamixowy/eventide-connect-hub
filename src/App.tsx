
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import Collaborations from "./pages/Collaborations";
import CollaborationDetails from "./pages/CollaborationDetails";
import CollaborationDetailsPage from "./pages/CollaborationDetailsPage";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Organizations from "./pages/Organizations";
import OrganizationProfile from "./pages/OrganizationProfile";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/logowanie" element={<Login />} />
            <Route path="/rejestracja" element={<Register />} />
            <Route path="/wydarzenia" element={<EventsList />} />
            <Route path="/wydarzenia/:id" element={<EventDetails />} />
            <Route path="/dodaj-wydarzenie" element={<AddEvent />} />
            <Route path="/edytuj-wydarzenie/:id" element={<EditEvent />} />
            <Route path="/wspolprace" element={<Collaborations />} />
            <Route path="/wspolprace/:id" element={<CollaborationDetailsPage />} />
            <Route path="/wiadomosci" element={<Messages />} />
            <Route path="/o-nas" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/organizacje" element={<Organizations />} />
            <Route path="/organizacje/:id" element={<OrganizationProfile />} />
            <Route path="/moje-wydarzenia" element={<MyEvents />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/moj-profil" element={<UserProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
