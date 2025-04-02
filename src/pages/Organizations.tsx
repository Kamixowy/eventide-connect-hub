
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Users, Calendar, Grid, List, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Przykładowe dane organizacji
const organizationsData = [
  {
    id: 1,
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    description: 'Nasza fundacja wspiera dzieci z domów dziecka i rodzin zastępczych. Organizujemy wydarzenia, wycieczki i zapewniamy materiały edukacyjne.',
    logo: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Warszawa, mazowieckie',
    category: 'Pomoc dzieciom',
    eventsCount: 12,
    followers: 356,
    foundationYear: 2010,
    website: 'https://www.example.org'
  },
  {
    id: 2,
    name: 'Stowarzyszenie Ochrony Zwierząt "Łapa"',
    description: 'Działamy na rzecz dobrostanu zwierząt. Prowadzimy schronisko, organizujemy akcje adopcyjne i edukacyjne dla społeczności lokalnej.',
    logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Kraków, małopolskie',
    category: 'Ochrona zwierząt',
    eventsCount: 8,
    followers: 412,
    foundationYear: 2015,
    website: 'https://www.example.org'
  },
  {
    id: 3,
    name: 'Eco Przyszłość',
    description: 'Zajmujemy się ochroną środowiska naturalnego. Organizujemy akcje sprzątania lasów, edukujemy społeczeństwo na temat recyklingu i zrównoważonego rozwoju.',
    logo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Wrocław, dolnośląskie',
    category: 'Ekologia',
    eventsCount: 15,
    followers: 289,
    foundationYear: 2018,
    website: 'https://www.example.org'
  },
  {
    id: 4,
    name: 'Fundacja Pomocy Seniorom "Złota Jesień"',
    description: 'Wspieramy osoby starsze, organizując dla nich zajęcia, warsztaty i spotkania. Pomagamy w codziennych czynnościach i zapewniamy wsparcie psychologiczne.',
    logo: 'https://images.unsplash.com/photo-1478061653917-455ba7f4a541?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Poznań, wielkopolskie',
    category: 'Pomoc seniorom',
    eventsCount: 6,
    followers: 178,
    foundationYear: 2012,
    website: 'https://www.example.org'
  },
  {
    id: 5,
    name: 'Stowarzyszenie Kulturalne "ARTeria"',
    description: 'Promujemy kulturę i sztukę wśród lokalnej społeczności. Organizujemy wystawy, koncerty, warsztaty artystyczne dla dzieci i dorosłych.',
    logo: 'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Gdańsk, pomorskie',
    category: 'Kultura i sztuka',
    eventsCount: 22,
    followers: 320,
    foundationYear: 2009,
    website: 'https://www.example.org'
  },
  {
    id: 6,
    name: 'Fundacja Edukacyjna "Nowa Szkoła"',
    description: 'Wspieramy rozwój edukacji w Polsce. Organizujemy warsztaty dla nauczycieli, konkursy dla uczniów i dbamy o nowoczesne wyposażenie szkół.',
    logo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Łódź, łódzkie',
    category: 'Edukacja',
    eventsCount: 10,
    followers: 245,
    foundationYear: 2014,
    website: 'https://www.example.org'
  },
  {
    id: 7,
    name: 'Sportowa Fundacja Młodzieżowa',
    description: 'Promujemy aktywność fizyczną wśród dzieci i młodzieży. Organizujemy zawody sportowe, obozy treningowe i zapewniamy sprzęt sportowy.',
    logo: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Katowice, śląskie',
    category: 'Sport',
    eventsCount: 18,
    followers: 390,
    foundationYear: 2016,
    website: 'https://www.example.org'
  },
  {
    id: 8,
    name: 'Stowarzyszenie Pomocy Osobom Niepełnosprawnym "Bez Barier"',
    description: 'Działamy na rzecz osób z niepełnosprawnościami. Organizujemy warsztaty, grupy wsparcia i pomagamy w zdobyciu odpowiedniego sprzętu rehabilitacyjnego.',
    logo: 'https://images.unsplash.com/photo-1469571486292-b5a973a610c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    location: 'Lublin, lubelskie',
    category: 'Pomoc niepełnosprawnym',
    eventsCount: 9,
    followers: 210,
    foundationYear: 2011,
    website: 'https://www.example.org'
  }
];

// Komponent karty organizacji w widoku siatki
const OrganizationCardGrid = ({ organization }: { organization: typeof organizationsData[0] }) => {
  return (
    <Card className="h-full hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={organization.logo} alt={organization.name} />
            <AvatarFallback>{organization.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-center">{organization.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin size={14} className="mr-1" /> {organization.location}
          </div>
        </div>
        
        <Badge className="mb-4 bg-ngo text-white">
          {organization.category}
        </Badge>
        
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
          {organization.description}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-sm">
          <div className="border rounded-md p-2">
            <p className="font-bold text-ngo">{organization.eventsCount}</p>
            <p className="text-muted-foreground">Wydarzenia</p>
          </div>
          <div className="border rounded-md p-2">
            <p className="font-bold text-ngo">{organization.followers}</p>
            <p className="text-muted-foreground">Obserwujący</p>
          </div>
          <div className="border rounded-md p-2">
            <p className="font-bold text-ngo">{organization.foundationYear}</p>
            <p className="text-muted-foreground">Założona</p>
          </div>
        </div>
        
        <Link to={`/organizacje/${organization.id}`}>
          <Button className="w-full">
            Zobacz profil
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Komponent karty organizacji w widoku listy
const OrganizationCardList = ({ organization }: { organization: typeof organizationsData[0] }) => {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={organization.logo} alt={organization.name} />
              <AvatarFallback>{organization.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <Badge className="mt-2 bg-ngo text-white">
              {organization.category}
            </Badge>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 className="text-xl font-bold">{organization.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1 mb-3">
                  <MapPin size={14} className="mr-1" /> {organization.location}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {organization.description}
                </p>
              </div>
              
              <div className="md:ml-4">
                <Link to={`/organizacje/${organization.id}`}>
                  <Button>
                    Zobacz profil
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex items-center">
                <Calendar className="mr-2 text-ngo" size={18} />
                <div>
                  <p className="text-sm font-medium">{organization.eventsCount} wydarzeń</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 text-ngo" size={18} />
                <div>
                  <p className="text-sm font-medium">{organization.followers} obserwujących</p>
                </div>
              </div>
              <div className="flex items-center">
                <Target className="mr-2 text-ngo" size={18} />
                <div>
                  <p className="text-sm font-medium">Od {organization.foundationYear} roku</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Organizations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrowanie organizacji
  const filteredOrganizations = organizationsData.filter((organization) => {
    const matchesSearch = searchQuery === '' || 
      organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organization.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || organization.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Unikalne kategorie dla filtra
  const categories = [...new Set(organizationsData.map(org => org.category))];

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organizacje</h1>
          <p className="text-muted-foreground">
            Poznaj organizacje zarejestrowane na naszej platformie
          </p>
        </div>

        {/* Wyszukiwarka i filtry */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj organizacji..."
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Znaleziono {filteredOrganizations.length} organizacji
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

        {/* Lista organizacji */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrganizations.map((organization) => (
              <OrganizationCardGrid 
                key={organization.id} 
                organization={organization} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrganizations.map((organization) => (
              <OrganizationCardList 
                key={organization.id} 
                organization={organization} 
              />
            ))}
          </div>
        )}
        
        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Brak organizacji spełniających kryteria</h3>
            <p className="text-muted-foreground mb-6">
              Spróbuj zmienić kryteria wyszukiwania lub filtry
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
            }}>
              Wyczyść filtry
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Organizations;
