import { CollaborationType } from "@/types/collaboration";

// Sample collaboration data
export const sampleCollaborations: CollaborationType[] = [
  {
    id: "1",
    event: {
      id: "101",
      title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
      organization: 'Fundacja Szczęśliwe Dzieciństwo',
      date: '15.06.2023',
      image: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    sponsor: {
      id: "201",
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
        id: "1",
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
      {
        id: 2,
        sender: 'organization',
        text: 'Dzień dobry, dziękujemy za propozycję. Jesteśmy zainteresowani Państwa ofertą. Czy mogliby Państwo przedstawić szczegółowy plan strefy edukacyjnej?',
        date: '10.01.2022 09:45'
      },
      {
        id: 3,
        sender: 'sponsor',
        text: 'Oczywiście. Proponujemy interaktywne warsztaty dla dzieci o segregacji odpadów, konkursy z nagrodami oraz prezentacje o odnawialnych źródłach energii. Dodatkowo możemy przygotować materiały edukacyjne dla dorosłych.',
        date: '15.01.2022 14:00'
      },
      {
        id: 4,
        sender: 'organization',
        text: 'Brzmi świetnie! Czy moglibyśmy zobaczyć przykładowe materiały edukacyjne i projekty warsztatów?',
        date: '20.01.2022 11:30'
      },
      {
        id: 5,
        sender: 'sponsor',
        text: 'Oczywiście, przesyłamy załączniki z materiałami. Jesteśmy otwarci na Państwa sugestie i propozycje zmian.',
        date: '25.01.2022 16:15'
      },
      {
        id: 6,
        sender: 'organization',
        text: 'Materiały są bardzo interesujące. Proponujemy dodanie elementu związanego z oszczędzaniem wody. Czy byliby Państwo w stanie to uwzględnić?',
        date: '01.02.2022 10:00'
      },
      {
        id: 7,
        sender: 'sponsor',
        text: 'Oczywiście, możemy dodać warsztaty o oszczędzaniu wody oraz przygotować ulotki informacyjne. Dziękujemy za cenną sugestię.',
        date: '05.02.2022 14:45'
      },
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
