
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Grid, List, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

// Przykładowe dane wydarzeń
const sampleEvents = [
  {
    id: 1,
    title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
    organization: 'Fundacja Szczęśliwe Dzieciństwo',
    date: '15.06.2023',
    location: 'Warszawa, mazowieckie',
    attendees: 350,
    category: 'Charytatywne',
    status: 'Planowane',
    description: 'Bieg charytatywny, z którego całkowity dochód zostanie przeznaczony na pomoc dzieciom w domach dziecka.',
    image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Festiwal Kultury Studenckiej',
    organization: 'Stowarzyszenie Młodych Artystów',
    date: '22.07.2023 - 25.07.2023',
    location: 'Kraków, małopolskie',
    attendees: 1200,
    category: 'Kulturalne',
    status: 'W przygotowaniu',
    description: 'Czterodniowy festiwal prezentujący osiągnięcia artystyczne studentów z całej Polski - muzyka, sztuka, teatr i film.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Eko Piknik Rodzinny',
    organization: 'Fundacja Zielona Przyszłość',
    date: '10.08.2023',
    location: 'Gdańsk, pomorskie',
    attendees: 500,
    category: 'Ekologiczne',
    status: 'Planowane',
    description: 'Piknik rodzinny połączony z warsztatami ekologicznymi i akcją sadzenia drzew w miejskim parku.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Międzynarodowy Turniej Siatkówki',
    organization: 'Stowarzyszenie Sportowe "Volley"',
    date: '05.09.2023 - 08.09.2023',
    location: 'Poznań, wielkopolskie',
    attendees: 800,
    category: 'Sportowe',
    status: 'W przygotowaniu',
    description: 'Międzynarodowy turniej siatkówki z udziałem drużyn z całej Europy. Zawody dla amatorów i profesjonalistów.',
    image: 'https://images.unsplash.com/photo-1588492069485-d05b56b2831d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Konferencja Naukowa "Innowacje w Medycynie"',
    organization: 'Fundacja Zdrowie i Nauka',
    date: '12.10.2023 - 13.10.2023',
    location: 'Wrocław, dolnośląskie',
    attendees: 400,
    category: 'Zdrowotne',
    status: 'Planowane',
    description: 'Dwudniowa konferencja naukowa poświęcona najnowszym osiągnięciom i technologiom w dziedzinie medycyny.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Targi Studenckiej Przedsiębiorczości',
    organization: 'Akademickie Inkubatory Przedsiębiorczości',
    date: '25.11.2023',
    location: 'Łódź, łódzkie',
    attendees: 600,
    category: 'Studenckie',
    status: 'Planowane',
    description: 'Targi prezentujące startupy i projekty stworzone przez studentów oraz młodych przedsiębiorców.',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Koncert "Młode Talenty Muzyczne"',
    organization: 'Fundacja Rozwoju Kultury i Sztuki',
    date: '08.12.2023',
    location: 'Katowice, śląskie',
    attendees: 300,
    category: 'Kulturalne',
    status: 'W przygotowaniu',
    description: 'Koncert prezentujący młodych, utalentowanych muzyków z całej Polski. Różne gatunki muzyczne od klasyki po jazz.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'Zimowy Maraton Charytatywny',
    organization: 'Stowarzyszenie "Biegamy i Pomagamy"',
    date: '15.01.2024',
    location: 'Zakopane, małopolskie',
    attendees: 250,
    category: 'Charytatywne',
    status: 'Planowane',
    description: 'Zimowy maraton, którego celem jest zebranie funduszy na rehabilitację dzieci z niepełnosprawnościami.',
    image: 'https://images.unsplash.com/photo-1551927336-09d50efd69cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

// Komponent karty wydarzenia w widoku kafelków
const EventCardGrid = ({ event }: { event: typeof sampleEvents[0] }) => {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-medium">
          {event.category}
        </div>
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
          ${event.status === 'Planowane' ? 'bg-blue-100 text-blue-700' : 
            event.status === 'W przygotowaniu' ? 'bg-yellow-100 text-yellow-700' : 
            event.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-700'}
        `}>
          {event.status}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{event.organization}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={16} className="mr-2 text-ngo" /> 
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users size={16} className="mr-2 text-ngo" /> 
            <span>Przewidywana liczba uczestników: {event.attendees}</span>
          </div>
        </div>
        
        <Link to={`/wydarzenia/${event.id}`}>
          <Button variant="outline" className="w-full">Zobacz szczegóły</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Komponent karty wydarzenia w widoku listy
const EventCardList = ({ event }: { event: typeof sampleEvents[0] }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/4 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-medium">
            {event.category}
          </div>
          <div className={`
            absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
            ${event.status === 'Planowane' ? 'bg-blue-100 text-blue-700' : 
              event.status === 'W przygotowaniu' ? 'bg-yellow-100 text-yellow-700' : 
              event.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 
              'bg-gray-100 text-gray-700'}
          `}>
            {event.status}
          </div>
        </div>
        <CardContent className="p-4 md:p-6 md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">{event.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{event.organization}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to={`/wydarzenia/${event.id}`}>
                <Button variant="outline">Zobacz szczegóły</Button>
              </Link>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-ngo" /> 
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-2 text-ngo" /> 
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users size={16} className="mr-2 text-ngo" /> 
              <span>Przewidywana liczba uczestników: {event.attendees}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const EventsList = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrowanie wydarzeń
  const filteredEvents = sampleEvents.filter((event) => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || event.category === categoryFilter;
    const matchesStatus = statusFilter === '' || event.status === statusFilter;
    const matchesRegion = regionFilter === '' || event.location.toLowerCase().includes(regionFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus && matchesRegion;
  });

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wydarzenia</h1>
          <p className="text-muted-foreground">
            Przeglądaj i znajdź interesujące Cię wydarzenia
          </p>
        </div>

        {/* Wyszukiwarka i filtry */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj wydarzeń..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filtry
            </Button>
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-ngo hover:bg-ngo/90' : ''}
              >
                <Grid size={18} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-ngo hover:bg-ngo/90' : ''}
              >
                <List size={18} />
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="text-sm font-medium block mb-2">Kategoria</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie kategorie</SelectItem>
                    <SelectItem value="Charytatywne">Charytatywne</SelectItem>
                    <SelectItem value="Kulturalne">Kulturalne</SelectItem>
                    <SelectItem value="Sportowe">Sportowe</SelectItem>
                    <SelectItem value="Ekologiczne">Ekologiczne</SelectItem>
                    <SelectItem value="Studenckie">Studenckie</SelectItem>
                    <SelectItem value="Zdrowotne">Zdrowotne</SelectItem>
                    <SelectItem value="Inne">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie statusy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie statusy</SelectItem>
                    <SelectItem value="Planowane">Planowane</SelectItem>
                    <SelectItem value="W przygotowaniu">W przygotowaniu</SelectItem>
                    <SelectItem value="W trakcie">W trakcie</SelectItem>
                    <SelectItem value="Zakończono">Zakończono</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Województwo</label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie regiony" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie regiony</SelectItem>
                    <SelectItem value="dolnośląskie">Dolnośląskie</SelectItem>
                    <SelectItem value="kujawsko-pomorskie">Kujawsko-pomorskie</SelectItem>
                    <SelectItem value="lubelskie">Lubelskie</SelectItem>
                    <SelectItem value="lubuskie">Lubuskie</SelectItem>
                    <SelectItem value="łódzkie">Łódzkie</SelectItem>
                    <SelectItem value="małopolskie">Małopolskie</SelectItem>
                    <SelectItem value="mazowieckie">Mazowieckie</SelectItem>
                    <SelectItem value="opolskie">Opolskie</SelectItem>
                    <SelectItem value="podkarpackie">Podkarpackie</SelectItem>
                    <SelectItem value="podlaskie">Podlaskie</SelectItem>
                    <SelectItem value="pomorskie">Pomorskie</SelectItem>
                    <SelectItem value="śląskie">Śląskie</SelectItem>
                    <SelectItem value="świętokrzyskie">Świętokrzyskie</SelectItem>
                    <SelectItem value="warmińsko-mazurskie">Warmińsko-mazurskie</SelectItem>
                    <SelectItem value="wielkopolskie">Wielkopolskie</SelectItem>
                    <SelectItem value="zachodniopomorskie">Zachodniopomorskie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Znaleziono {filteredEvents.length} wydarzeń
            </p>
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-ngo hover:bg-ngo/90' : ''}
              >
                <Grid size={18} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-ngo hover:bg-ngo/90' : ''}
              >
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Lista wydarzeń */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCardGrid key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <EventCardList key={event.id} event={event} />
            ))}
          </div>
        )}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Brak wydarzeń spełniających kryteria</h3>
            <p className="text-muted-foreground mb-6">
              Spróbuj zmienić kryteria wyszukiwania lub filtry
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
              setRegionFilter('');
            }}>
              Wyczyść filtry
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsList;
