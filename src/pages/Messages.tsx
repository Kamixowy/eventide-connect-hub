
import { useState } from 'react';
import { Search, Send, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';

// Przykładowe dane wiadomości
const sampleConversations = [
  {
    id: 1,
    recipient: {
      id: 101,
      name: 'Fundacja Szczęśliwe Dzieciństwo',
      avatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      type: 'organization'
    },
    lastMessage: {
      text: 'Dzień dobry, jesteśmy zainteresowani sponsorowaniem Państwa wydarzenia jako Partner Główny. Proszę o kontakt w celu ustalenia szczegółów współpracy.',
      timestamp: '28.04.2023 10:25',
      isRead: true,
      sender: 'user'
    },
    messages: [
      {
        id: 1,
        text: 'Dzień dobry, jesteśmy zainteresowani sponsorowaniem Państwa wydarzenia jako Partner Główny. Proszę o kontakt w celu ustalenia szczegółów współpracy.',
        timestamp: '28.04.2023 10:25',
        sender: 'user'
      }
    ]
  },
  {
    id: 2,
    recipient: {
      id: 102,
      name: 'CreativeDesign Sp. z o.o.',
      avatar: 'https://images.unsplash.com/photo-1549297161-14f79605a74c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      type: 'sponsor'
    },
    lastMessage: {
      text: 'Propozycja brzmi interesująco. Czy moglibyśmy ustalić szczegóły dotyczące projektów graficznych? Jakie materiały byliby Państwo w stanie przygotować i w jakim terminie?',
      timestamp: '26.04.2023 15:20',
      isRead: false,
      sender: 'recipient'
    },
    messages: [
      {
        id: 1,
        text: 'Witam, jako firma z branży kreatywnej chcielibyśmy wesprzeć Państwa wydarzenie. Interesują nas dwie opcje współpracy - Partner Wspierający oraz Sponsor Nagród.',
        timestamp: '15.04.2023 14:30',
        sender: 'recipient'
      },
      {
        id: 2,
        text: 'Dzień dobry, dziękujemy za zainteresowanie. Jesteśmy otwarci na współpracę, jednak w przypadku opcji Partner Wspierający oczekujemy minimalnego wsparcia w wysokości 3500 zł. Czy taka kwota byłaby dla Państwa akceptowalna?',
        timestamp: '18.04.2023 09:15',
        sender: 'user'
      },
      {
        id: 3,
        text: 'Dzień dobry, rozumiemy Państwa oczekiwania. Proponujemy kompromis: 3000 zł za opcję Partner Wspierający plus dodatkowe wsparcie w postaci usług projektowych o wartości 1000 zł (projekty graficzne materiałów promocyjnych). Łącznie wartość wsparcia wyniesie 4000 zł. Czy taka propozycja jest dla Państwa interesująca?',
        timestamp: '20.04.2023 11:45',
        sender: 'recipient'
      },
      {
        id: 4,
        text: 'Propozycja brzmi interesująco. Czy moglibyśmy ustalić szczegóły dotyczące projektów graficznych? Jakie materiały byliby Państwo w stanie przygotować i w jakim terminie?',
        timestamp: '26.04.2023 15:20',
        sender: 'user'
      }
    ]
  },
  {
    id: 3,
    recipient: {
      id: 103,
      name: 'SportEquipment Polska',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      type: 'sponsor'
    },
    lastMessage: {
      text: 'Świetnie! Przesyłamy logo w załączniku. Koszulki proponujemy w kolorze białym z niebieskimi akcentami, zgodnie z naszą identyfikacją wizualną. Czy taka kolorystyka Państwu odpowiada?',
      timestamp: '20.03.2023 10:10',
      isRead: true,
      sender: 'recipient'
    },
    messages: [
      {
        id: 1,
        text: 'Jako firma produkująca sprzęt sportowy chcielibyśmy zostać Partnerem Głównym Państwa turnieju. Oferujemy wsparcie finansowe oraz sprzęt sportowy dla uczestników.',
        timestamp: '10.03.2023 11:00',
        sender: 'recipient'
      },
      {
        id: 2,
        text: 'Dzień dobry, dziękujemy za zainteresowanie. Bardzo cieszymy się z możliwości współpracy. Prosimy o doprecyzowanie, jaki sprzęt sportowy byliby Państwo w stanie przekazać?',
        timestamp: '12.03.2023 14:30',
        sender: 'user'
      },
      {
        id: 3,
        text: 'Proponujemy przekazanie 20 profesjonalnych piłek do siatkówki, 4 siatek turniejowych oraz 50 kompletów koszulek dla uczestników z logo naszej firmy oraz Państwa turnieju.',
        timestamp: '15.03.2023 09:45',
        sender: 'recipient'
      },
      {
        id: 4,
        text: 'Propozycja jest bardzo atrakcyjna. Akceptujemy warunki współpracy. Prosimy o przesłanie logo w wysokiej rozdzielczości oraz określenie kolorystyki koszulek.',
        timestamp: '18.03.2023 13:20',
        sender: 'user'
      },
      {
        id: 5,
        text: 'Świetnie! Przesyłamy logo w załączniku. Koszulki proponujemy w kolorze białym z niebieskimi akcentami, zgodnie z naszą identyfikacją wizualną. Czy taka kolorystyka Państwu odpowiada?',
        timestamp: '20.03.2023 10:10',
        sender: 'recipient'
      }
    ]
  },
  {
    id: 4,
    recipient: {
      id: 104,
      name: 'Stowarzyszenie Młodych Artystów',
      avatar: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      type: 'organization'
    },
    lastMessage: {
      text: 'Zapraszamy na nasz najbliższy festiwal. Byłoby nam bardzo miło, gdyby przedstawiciele Państwa firmy mogli być obecni na wydarzeniu.',
      timestamp: '05.05.2023 11:30',
      isRead: true,
      sender: 'recipient'
    },
    messages: [
      {
        id: 1,
        text: 'Zapraszamy na nasz najbliższy festiwal. Byłoby nam bardzo miło, gdyby przedstawiciele Państwa firmy mogli być obecni na wydarzeniu.',
        timestamp: '05.05.2023 11:30',
        sender: 'recipient'
      }
    ]
  }
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'organization' | 'sponsor'>('all');
  
  // Filtrowanie konwersacji
  const filteredConversations = sampleConversations.filter((conversation) => {
    const matchesSearch = searchQuery === '' || 
      conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || conversation.recipient.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // W pełnej aplikacji tutaj byłoby wysyłanie wiadomości do API
      console.log('Wysyłanie wiadomości:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Wiadomości</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista konwersacji */}
          <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Szukaj wiadomości..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <button 
                  className="flex items-center text-sm font-medium"
                  onClick={() => setExpandedFilters(!expandedFilters)}
                >
                  Filtry
                  {expandedFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </button>
                <Button variant="ghost" size="sm" className="text-ngo">
                  <Plus size={16} className="mr-1" /> Nowa wiadomość
                </Button>
              </div>
              
              {expandedFilters && (
                <div className="flex flex-wrap gap-2 py-2">
                  <Badge 
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    className={typeFilter === 'all' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('all')}
                  >
                    Wszystkie
                  </Badge>
                  <Badge 
                    variant={typeFilter === 'organization' ? 'default' : 'outline'}
                    className={typeFilter === 'organization' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('organization')}
                  >
                    Organizacje
                  </Badge>
                  <Badge 
                    variant={typeFilter === 'sponsor' ? 'default' : 'outline'}
                    className={typeFilter === 'sponsor' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('sponsor')}
                  >
                    Sponsorzy
                  </Badge>
                </div>
              )}
            </div>
            
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation.id === conversation.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                        <AvatarFallback>{conversation.recipient.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {conversation.recipient.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {conversation.lastMessage.timestamp.split(' ')[0]}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className={`text-xs truncate ${!conversation.lastMessage.isRead && conversation.lastMessage.sender === 'recipient' ? 'font-semibold' : 'text-muted-foreground'}`}>
                            {conversation.lastMessage.text}
                          </p>
                          {!conversation.lastMessage.isRead && conversation.lastMessage.sender === 'recipient' && (
                            <span className="ml-2 h-2 w-2 rounded-full bg-ngo"></span>
                          )}
                        </div>
                        <div className="mt-1">
                          <Badge 
                            variant="outline"
                            className={`text-xs px-1.5 py-0 ${
                              conversation.recipient.type === 'organization' 
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                                : 'bg-green-50 text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {conversation.recipient.type === 'organization' ? 'Organizacja' : 'Sponsor'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Nie znaleziono wiadomości spełniających kryteria wyszukiwania
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Widok konwersacji */}
          <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col bg-white">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.recipient.avatar} alt={selectedConversation.recipient.name} />
                      <AvatarFallback>{selectedConversation.recipient.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.recipient.name}</p>
                      <Badge 
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          selectedConversation.recipient.type === 'organization' 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                            : 'bg-green-50 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {selectedConversation.recipient.type === 'organization' ? 'Organizacja' : 'Sponsor'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="flex-grow p-4 h-[calc(100vh-420px)]">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user' 
                              ? 'bg-ngo text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-end space-x-2">
                    <Textarea
                      placeholder="Napisz wiadomość..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <Button 
                      className="btn-gradient"
                      size="icon"
                      onClick={handleSendMessage}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
                Wybierz konwersację, aby wyświetlić wiadomości
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
