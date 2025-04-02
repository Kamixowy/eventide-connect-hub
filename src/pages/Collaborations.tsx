
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Grid, 
  List,
  Clock,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

// Przykładowe dane współprac
const sampleCollaborations = [
  {
    id: 1,
    event: {
      id: 101,
      title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
      organization: 'Fundacja Szczęśliwe Dzieciństwo',
      date: '15.06.2023',
      image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    sponsor: {
      id: 201,
      name: 'TechCorp Polska',
      avatar: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    status: 'Przesłana',
    createdAt: '28.04.2023',
    lastUpdated: '28.04.2023',
    sponsorshipOptions: [
      {
        title: 'Partner Główny',
        description: 'Logo na materiałach promocyjnych, bannery na miejscu wydarzenia, miejsce na stoisko.',
        amount: 8000
      }
    ],
    totalAmount: 8000,
    message: 'Dzień dobry, jesteśmy zainteresowani sponsorowaniem Państwa wydarzenia jako Partner Główny. Proszę o kontakt w celu ustalenia szczegółów współpracy.',
    conversation: [
      {
        id: 1,
        sender: 'sponsor',
        text: 'Dzień dobry, jesteśmy zainteresowani sponsorowaniem Państwa wydarzenia jako Partner Główny. Proszę o kontakt w celu ustalenia szczegółów współpracy.',
        date: '28.04.2023 10:25'
      }
    ]
  },
  {
    id: 2,
    event: {
      id: 102,
      title: 'Festiwal Kultury Studenckiej',
      organization: 'Stowarzyszenie Młodych Artystów',
      date: '22.07.2023 - 25.07.2023',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    sponsor: {
      id: 202,
      name: 'CreativeDesign Sp. z o.o.',
      avatar: 'https://images.unsplash.com/photo-1549297161-14f79605a74c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    status: 'Negocjacje',
    createdAt: '15.04.2023',
    lastUpdated: '26.04.2023',
    sponsorshipOptions: [
      {
        title: 'Partner Wspierający',
        description: 'Logo na materiałach promocyjnych, banner na miejscu wydarzenia.',
        amount: 3000
      },
      {
        title: 'Sponsor Nagród',
        description: 'Przekazanie nagród dla uczestników, wyróżnienie podczas ceremonii.',
        amount: 2000
      }
    ],
    totalAmount: 5000,
    message: 'Witam, jako firma z branży kreatywnej chcielibyśmy wesprzeć Państwa wydarzenie. Interesują nas dwie opcje współpracy - Partner Wspierający oraz Sponsor Nagród.',
    conversation: [
      {
        id: 1,
        sender: 'sponsor',
        text: 'Witam, jako firma z branży kreatywnej chcielibyśmy wesprzeć Państwa wydarzenie. Interesują nas dwie opcje współpracy - Partner Wspierający oraz Sponsor Nagród.',
        date: '15.04.2023 14:30'
      },
      {
        id: 2,
        sender: 'organization',
        text: 'Dzień dobry, dziękujemy za zainteresowanie. Jesteśmy otwarci na współpracę, jednak w przypadku opcji Partner Wspierający oczekujemy minimalnego wsparcia w wysokości 3500 zł. Czy taka kwota byłaby dla Państwa akceptowalna?',
        date: '18.04.2023 09:15'
      },
      {
        id: 3,
        sender: 'sponsor',
        text: 'Dzień dobry, rozumiemy Państwa oczekiwania. Proponujemy kompromis: 3000 zł za opcję Partner Wspierający plus dodatkowe wsparcie w postaci usług projektowych o wartości 1000 zł (projekty graficzne materiałów promocyjnych). Łącznie wartość wsparcia wyniesie 4000 zł. Czy taka propozycja jest dla Państwa interesująca?',
        date: '20.04.2023 11:45'
      },
      {
        id: 4,
        sender: 'organization',
        text: 'Propozycja brzmi interesująco. Czy moglibyśmy ustalić szczegóły dotyczące projektów graficznych? Jakie materiały byliby Państwo w stanie przygotować i w jakim terminie?',
        date: '26.04.2023 15:20'
      }
    ]
  },
  {
    id: 3,
    event: {
      id: 103,
      title: 'Międzynarodowy Turniej Siatkówki',
      organization: 'Stowarzyszenie Sportowe "Volley"',
      date: '05.09.2023 - 08.09.2023',
      image: 'https://images.unsplash.com/photo-1588492069485-d05b56b2831d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    sponsor: {
      id: 203,
      name: 'SportEquipment Polska',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    status: 'W trakcie',
    createdAt: '10.03.2023',
    lastUpdated: '20.04.2023',
    sponsorshipOptions: [
      {
        title: 'Partner Główny',
        description: 'Logo na materiałach promocyjnych, bannery na miejscu wydarzenia, miejsce na stoisko, logo na koszulkach uczestników.',
        amount: 15000
      }
    ],
    totalAmount: 15000,
    message: 'Jako firma produkująca sprzęt sportowy chcielibyśmy zostać Partnerem Głównym Państwa turnieju. Oferujemy wsparcie finansowe oraz sprzęt sportowy dla uczestników.',
    conversation: [
      {
        id: 1,
        sender: 'sponsor',
        text: 'Jako firma produkująca sprzęt sportowy chcielibyśmy zostać Partnerem Głównym Państwa turnieju. Oferujemy wsparcie finansowe oraz sprzęt sportowy dla uczestników.',
        date: '10.03.2023 11:00'
      },
      {
        id: 2,
        sender: 'organization',
        text: 'Dzień dobry, dziękujemy za zainteresowanie. Bardzo cieszymy się z możliwości współpracy. Prosimy o doprecyzowanie, jaki sprzęt sportowy byliby Państwo w stanie przekazać?',
        date: '12.03.2023 14:30'
      },
      {
        id: 3,
        sender: 'sponsor',
        text: 'Proponujemy przekazanie 20 profesjonalnych piłek do siatkówki, 4 siatek turniejowych oraz 50 kompletów koszulek dla uczestników z logo naszej firmy oraz Państwa turnieju.',
        date: '15.03.2023 09:45'
      },
      {
        id: 4,
        sender: 'organization',
        text: 'Propozycja jest bardzo atrakcyjna. Akceptujemy warunki współpracy. Prosimy o przesłanie logo w wysokiej rozdzielczości oraz określenie kolorystyki koszulek.',
        date: '18.03.2023 13:20'
      },
      {
        id: 5,
        sender: 'sponsor',
        text: 'Świetnie! Przesyłamy logo w załączniku. Koszulki proponujemy w kolorze białym z niebieskimi akcentami, zgodnie z naszą identyfikacją wizualną. Czy taka kolorystyka Państwu odpowiada?',
        date: '20.03.2023 10:10'
      },
      {
        id: 6,
        sender: 'organization',
        text: 'Kolorystyka jest odpowiednia. Prosimy o informację, kiedy możemy spodziewać się dostawy sprzętu. Przygotowujemy już materiały promocyjne z Państwa logo.',
        date: '22.03.2023 16:35'
      },
      {
        id: 7,
        sender: 'sponsor',
        text: 'Sprzęt będzie gotowy do odbioru w naszej siedzibie od 15 maja. Możemy również zorganizować dostawę bezpośrednio na miejsce wydarzenia. Co Państwu bardziej odpowiada?',
        date: '25.03.2023 11:50'
      },
      {
        id: 8,
        sender: 'organization',
        text: 'Dostawa bezpośrednio na miejsce wydarzenia byłaby idealna. Dziękujemy za elastyczność. Umowa została wysłana na Państwa adres e-mail.',
        date: '30.03.2023 09:25'
      },
      {
        id: 9,
        sender: 'sponsor',
        text: 'Umowa podpisana i odesłana. Cieszymy się na współpracę! Będziemy w kontakcie odnośnie szczegółów logistycznych.',
        date: '05.04.2023 14:15'
      },
      {
        id: 10,
        sender: 'organization',
        text: 'Otrzymaliśmy podpisaną umowę. Dziękujemy! Rozpoczynamy przygotowania materiałów promocyjnych. Na bieżąco będziemy informować o postępach.',
        date: '10.04.2023 15:40'
      },
      {
        id: 11,
        sender: 'sponsor',
        text: 'Świetnie! Nasze przygotowania również idą zgodnie z planem. Sprzęt jest już w produkcji, a koszulki w druku. Wszystko będzie gotowe na czas.',
        date: '20.04.2023 13:10'
      }
    ]
  },
  {
    id: 4,
    event: {
      id: 104,
      title: 'Eko Piknik Rodzinny',
      organization: 'Fundacja Zielona Przyszłość',
      date: '10.08.2023',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    sponsor: {
      id: 204,
      name: 'EcoSolutions S.A.',
      avatar: 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    status: 'Zrealizowana',
    createdAt: '05.01.2023',
    lastUpdated: '20.08.2022',
    sponsorshipOptions: [
      {
        title: 'Partner Ekologiczny',
        description: 'Strefa edukacyjna o tematyce ekologicznej, logo na materiałach promocyjnych.',
        amount: 6000
      }
    ],
    totalAmount: 6000,
    message: 'Jako firma zajmująca się rozwiązaniami ekologicznymi, chcielibyśmy wesprzeć Państwa wydarzenie. Możemy przygotować strefę edukacyjną dla dzieci i dorosłych.',
    conversation: [
      {
        id: 1,
        sender: 'sponsor',
        text: 'Jako firma zajmująca się rozwiązaniami ekologicznymi, chcielibyśmy wesprzeć Państwa wydarzenie. Możemy przygotować strefę edukacyjną dla dzieci i dorosłych.',
        date: '05.01.2022 13:20'
      },
      // ... pozostała część historii konwersacji
      {
        id: 8,
        sender: 'organization',
        text: 'Dziękujemy za fantastyczną współpracę! Piknik został zrealizowany z ogromnym sukcesem, a Państwa strefa edukacyjna cieszyła się dużym zainteresowaniem. Przesyłamy zdjęcia i podsumowanie wydarzenia.',
        date: '15.08.2022 16:40'
      },
      {
        id: 9,
        sender: 'sponsor',
        text: 'Dziękujemy za przesłane materiały. Również jesteśmy bardzo zadowoleni ze współpracy. Liczymy na kontynuację w przyszłym roku!',
        date: '20.08.2022 10:15'
      }
    ]
  }
];

// Komponent karty współpracy w widoku kafelków
const CollaborationCardGrid = ({ 
  collaboration, 
  userType 
}: { 
  collaboration: typeof sampleCollaborations[0], 
  userType: 'organization' | 'sponsor' 
}) => {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={collaboration.event.image} 
          alt={collaboration.event.title} 
          className="object-cover w-full h-full"
        />
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
          ${collaboration.status === 'Przesłana' ? 'bg-blue-100 text-blue-700' : 
            collaboration.status === 'Negocjacje' ? 'bg-yellow-100 text-yellow-700' : 
            collaboration.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-700'}
        `}>
          {collaboration.status}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{collaboration.event.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{collaboration.event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-ngo" /> 
            <span>Ostatnia aktualizacja: {collaboration.lastUpdated}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <span>Kwota: {collaboration.totalAmount} PLN</span>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <MessageSquare size={16} className="mr-2" /> Konwersacja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Szczegóły współpracy</DialogTitle>
              <DialogDescription>
                {collaboration.event.title} - {collaboration.status}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Organizacja</p>
                <p className="font-medium">{collaboration.event.organization}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sponsor</p>
                <p className="font-medium">{collaboration.sponsor.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wartość</p>
                <p className="font-medium">{collaboration.totalAmount} PLN</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Opcje współpracy</h3>
              <div className="space-y-2">
                {collaboration.sponsorshipOptions.map((option, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{option.title}</p>
                      <p>{option.amount} PLN</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Konwersacja</h3>
              <div className="max-h-80 overflow-y-auto space-y-3 border rounded-md p-3">
                {collaboration.conversation.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'sponsor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'sponsor' 
                          ? 'bg-ngo text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'sponsor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Input placeholder="Napisz wiadomość..." className="flex-grow" />
                <Button>Wyślij</Button>
              </div>
              
              <div className="flex justify-between mt-6">
                {collaboration.status === 'Przesłana' && userType === 'organization' && (
                  <>
                    <Button variant="outline" className="flex items-center">
                      <XCircle size={16} className="mr-2" /> Odrzuć
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" className="flex items-center">
                        <Edit size={16} className="mr-2" /> Zaproponuj zmiany
                      </Button>
                      <Button className="flex items-center btn-gradient">
                        <CheckCircle size={16} className="mr-2" /> Akceptuj
                      </Button>
                    </div>
                  </>
                )}
                
                {collaboration.status === 'Negocjacje' && (
                  <Button className="ml-auto btn-gradient">
                    <CheckCircle size={16} className="mr-2" /> Akceptuj warunki
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Komponent karty współpracy w widoku listy
const CollaborationCardList = ({ 
  collaboration, 
  userType 
}: { 
  collaboration: typeof sampleCollaborations[0], 
  userType: 'organization' | 'sponsor' 
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/4 overflow-hidden">
          <img 
            src={collaboration.event.image} 
            alt={collaboration.event.title} 
            className="object-cover w-full h-full"
          />
          <div className={`
            absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
            ${collaboration.status === 'Przesłana' ? 'bg-blue-100 text-blue-700' : 
              collaboration.status === 'Negocjacje' ? 'bg-yellow-100 text-yellow-700' : 
              collaboration.status === 'W trakcie' ? 'bg-green-100 text-green-700' : 
              'bg-gray-100 text-gray-700'}
          `}>
            {collaboration.status}
          </div>
        </div>
        <CardContent className="p-4 md:p-6 md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">{collaboration.event.title}</h3>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage 
                    src={userType === 'organization' ? collaboration.sponsor.avatar : collaboration.event.image} 
                    alt={userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization} 
                  />
                  <AvatarFallback>
                    {userType === 'organization' 
                      ? collaboration.sponsor.name.substring(0, 2) 
                      : collaboration.event.organization.substring(0, 2)
                    }
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground text-sm">
                  {userType === 'organization' ? collaboration.sponsor.name : collaboration.event.organization}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <p className="font-medium mb-1">Kwota: {collaboration.totalAmount} PLN</p>
              <p className="text-sm text-muted-foreground mb-2">Ostatnia aktualizacja: {collaboration.lastUpdated}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare size={16} className="mr-2" /> Konwersacja
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Szczegóły współpracy</DialogTitle>
                    <DialogDescription>
                      {collaboration.event.title} - {collaboration.status}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Organizacja</p>
                      <p className="font-medium">{collaboration.event.organization}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sponsor</p>
                      <p className="font-medium">{collaboration.sponsor.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Wartość</p>
                      <p className="font-medium">{collaboration.totalAmount} PLN</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Opcje współpracy</h3>
                    <div className="space-y-2">
                      {collaboration.sponsorshipOptions.map((option, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <p className="font-medium">{option.title}</p>
                            <p>{option.amount} PLN</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Konwersacja</h3>
                    <div className="max-h-80 overflow-y-auto space-y-3 border rounded-md p-3">
                      {collaboration.conversation.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'sponsor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'sponsor' 
                                ? 'bg-ngo text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'sponsor' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Input placeholder="Napisz wiadomość..." className="flex-grow" />
                      <Button>Wyślij</Button>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      {collaboration.status === 'Przesłana' && userType === 'organization' && (
                        <>
                          <Button variant="outline" className="flex items-center">
                            <XCircle size={16} className="mr-2" /> Odrzuć
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" className="flex items-center">
                              <Edit size={16} className="mr-2" /> Zaproponuj zmiany
                            </Button>
                            <Button className="flex items-center btn-gradient">
                              <CheckCircle size={16} className="mr-2" /> Akceptuj
                            </Button>
                          </div>
                        </>
                      )}
                      
                      {collaboration.status === 'Negocjacje' && (
                        <Button className="ml-auto btn-gradient">
                          <CheckCircle size={16} className="mr-2" /> Akceptuj warunki
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-ngo" /> 
              <span>{collaboration.event.date}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 text-ngo" /> 
              <span>Utworzono: {collaboration.createdAt}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Opcje współpracy:</p>
            <div className="flex flex-wrap gap-2">
              {collaboration.sponsorshipOptions.map((option, index) => (
                <Badge key={index} variant="outline">
                  {option.title}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const Collaborations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userType, setUserType] = useState<'organization' | 'sponsor'>('organization');

  // Filtrowanie współprac
  const filteredCollaborations = sampleCollaborations.filter((collaboration) => {
    const matchesSearch = searchQuery === '' || 
      collaboration.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.sponsor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || collaboration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Współprace</h1>
          <p className="text-muted-foreground">
            Zarządzaj swoimi współpracami
          </p>
        </div>

        {/* Przełącznik typu użytkownika (demo) */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-md border">
            <Button
              variant="ghost"
              className={`rounded-r-none ${userType === 'organization' ? 'bg-ngo/10 text-ngo' : ''}`}
              onClick={() => setUserType('organization')}
            >
              Widok organizacji
            </Button>
            <Button
              variant="ghost"
              className={`rounded-l-none ${userType === 'sponsor' ? 'bg-ngo/10 text-ngo' : ''}`}
              onClick={() => setUserType('sponsor')}
            >
              Widok sponsora
            </Button>
          </div>
        </div>

        {/* Wyszukiwarka i filtry */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj współprac..."
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
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie statusy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie statusy</SelectItem>
                    <SelectItem value="Przesłana">Przesłana</SelectItem>
                    <SelectItem value="Negocjacje">Negocjacje</SelectItem>
                    <SelectItem value="W trakcie">W trakcie</SelectItem>
                    <SelectItem value="Zrealizowana">Zrealizowana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Znaleziono {filteredCollaborations.length} współprac
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

        {/* Lista współprac */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCollaborations.map((collaboration) => (
              <CollaborationCardGrid 
                key={collaboration.id} 
                collaboration={collaboration} 
                userType={userType}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCollaborations.map((collaboration) => (
              <CollaborationCardList 
                key={collaboration.id} 
                collaboration={collaboration} 
                userType={userType}
              />
            ))}
          </div>
        )}
        
        {filteredCollaborations.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Brak współprac spełniających kryteria</h3>
            <p className="text-muted-foreground mb-6">
              Spróbuj zmienić kryteria wyszukiwania lub filtry
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
            }}>
              Wyczyść filtry
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Collaborations;
